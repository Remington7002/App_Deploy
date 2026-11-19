const express = require('express');
const { CATEGORIES, STATUS_KEYS } = require('../utils/constants');
const router = express.Router();
router.get('/categories', (req, res) => res.json({ categories: CATEGORIES }));
router.get('/statuses', (req, res) => res.json({ statuses: STATUS_KEYS }));
module.exports = router;
