const express = require('express');
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const { requireAuth, complaintScope, permit } = require('../middleware/auth');
const { CATEGORY_KEYS, STATUS_KEYS, DEPARTMENT_BY_CATEGORY } = require('../utils/constants');
const { fail, clean, escapeRegExp } = require('../utils/http');
const router = express.Router();
router.use(requireAuth);

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) fail(400, 'Invalid complaint ID');
}

function validateImageUrl(value) {
  if (!value) return '';
  const url = clean(value);
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol) || url.length > 1000) throw new Error('Invalid URL');
    return url;
  } catch { fail(400, 'imageUrl must be an http(s) image URL'); }
}

router.post('/', permit('student'), async (req, res) => {
  const title = clean(req.body?.title);
  const description = clean(req.body?.description);
  const category = clean(req.body?.category).toLowerCase();
  const location = clean(req.body?.location);
  const priority = clean(req.body?.priority || 'medium').toLowerCase();
  if (title.length < 5 || title.length > 150) fail(400, 'Title must contain 5–150 characters');
  if (description.length < 10 || description.length > 5000) fail(400, 'Description must contain 10–5000 characters');
  if (!CATEGORY_KEYS.includes(category)) fail(400, `Invalid category. Use: ${CATEGORY_KEYS.join(', ')}`);
  if (location.length > 150) fail(400, 'Location must be at most 150 characters');
  if (!['low', 'medium', 'high'].includes(priority)) fail(400, 'Priority must be low, medium or high');
  const imageUrl = validateImageUrl(req.body?.imageUrl);
  const complaint = await Complaint.create({
    student: req.user._id, title, description, category,
    department: DEPARTMENT_BY_CATEGORY[category], // Server controls routing.
    location, priority, imageUrl,
    history: [{ status: 'pending', note: 'Complaint submitted and automatically assigned', changedBy: req.user._id, changedByName: req.user.name }],
  });
  res.status(201).json({ message: 'Complaint submitted successfully', complaint });
});

// Every role gets a server-scoped complaint list (student: own; dept admin: only department; super admin: all).
router.get('/', async (req, res) => {
  const filter = { ...complaintScope(req.user) };
  if (req.query.status) {
    if (!STATUS_KEYS.includes(req.query.status)) fail(400, 'Invalid status filter');
    filter.status = req.query.status;
  }
  if (req.query.category) {
    if (!CATEGORY_KEYS.includes(req.query.category)) fail(400, 'Invalid category filter');
    filter.category = req.query.category;
  }
  if (req.query.department) {
    if (req.user.role !== 'super_admin') fail(403, 'Department filter is reserved for Super Admin');
    if (!Object.values(DEPARTMENT_BY_CATEGORY).includes(req.query.department)) fail(400, 'Invalid department filter');
    filter.department = req.query.department;
  }
  const search = clean(req.query.search).slice(0, 80);
  if (search) {
    const regex = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ title: regex }, { description: regex }, { ticketId: regex }];
  }
  const page = Math.max(1, Math.min(10000, Number.parseInt(req.query.page, 10) || 1));
  const limit = Math.max(1, Math.min(100, Number.parseInt(req.query.limit, 10) || 15));
  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .select('-history -remarks')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('student', 'name email')
      .lean(),
    Complaint.countDocuments(filter),
  ]);
  res.json({ complaints, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
});

router.get('/:id', async (req, res) => {
  validateId(req.params.id);
  const complaint = await Complaint.findOne({ _id: req.params.id, ...complaintScope(req.user) })
    .populate('student', 'name email');
  if (!complaint) fail(404, 'Complaint not found or access denied');
  res.json({ complaint });
});

router.patch('/:id/status', permit('department_admin', 'super_admin'), async (req, res) => {
  validateId(req.params.id);
  const status = clean(req.body?.status);
  const note = clean(req.body?.note || req.body?.remark);
  if (!STATUS_KEYS.includes(status)) fail(400, 'Invalid complaint status');
  if (note.length > 2000) fail(400, 'Remark is too long');
  if (status === 'rejected' && !note) fail(400, 'A rejection reason is required');
  const complaint = await Complaint.findOne({ _id: req.params.id, ...complaintScope(req.user) });
  if (!complaint) fail(404, 'Complaint not found or access denied');
  if (complaint.status === status && !note) fail(400, 'Status is already set to this value');
  complaint.status = status;
  complaint.resolvedAt = status === 'resolved' ? new Date() : null;
  complaint.history.push({ status, note, changedBy: req.user._id, changedByName: req.user.name });
  if (note) complaint.remarks.push({ message: note, author: req.user._id, authorName: req.user.name });
  await complaint.save();
  res.json({ message: 'Complaint status updated', complaint });
});

router.post('/:id/remarks', permit('department_admin', 'super_admin'), async (req, res) => {
  validateId(req.params.id);
  const message = clean(req.body?.message);
  if (!message || message.length > 2000) fail(400, 'Remark must contain 1–2000 characters');
  const complaint = await Complaint.findOne({ _id: req.params.id, ...complaintScope(req.user) });
  if (!complaint) fail(404, 'Complaint not found or access denied');
  complaint.remarks.push({ message, author: req.user._id, authorName: req.user.name });
  await complaint.save();
  res.status(201).json({ message: 'Remark added', complaint });
});

module.exports = router;
