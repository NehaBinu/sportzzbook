const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

// Get all opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({ createdAt: 1 });
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create an opportunity
router.post('/', async (req, res) => {
  try {
    const opportunity = await Opportunity.create(req.body);
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;