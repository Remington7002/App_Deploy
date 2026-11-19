const express = require('express');
const Complaint = require('../models/Complaint');
const { requireAuth, complaintScope } = require('../middleware/auth');
const { CATEGORIES, STATUS_KEYS } = require('../utils/constants');
const router = express.Router();
router.use(requireAuth);

// All analytics honor role scope on the server.
router.get('/stats', async (req, res) => {
  const match = complaintScope(req.user);
  const [total, statusGroups, departmentGroups, categoryGroups, recent] = await Promise.all([
    Complaint.countDocuments(match),
    Complaint.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $match: match }, { $group: { _id: '$department', count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $match: match }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
    Complaint.find(match).select('ticketId title category department status priority createdAt')
      .sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  const groupCount = (groups, key) => groups.find(item => item._id === key)?.count || 0;
  const byStatus = Object.fromEntries(STATUS_KEYS.map(key => [key, groupCount(statusGroups, key)]));
  const byDepartment = CATEGORIES.map(item => ({
    department: item.department, label: item.departmentName,
    count: groupCount(departmentGroups, item.department),
  }));
  const byCategory = CATEGORIES.map(item => ({ category: item.key, label: item.label, count: groupCount(categoryGroups, item.key) }));
  const resolutionRate = total ? Math.round((byStatus.resolved / total) * 100) : 0;
  res.json({ total, byStatus, byDepartment, byCategory, resolutionRate, recent });
});

module.exports = router;
