const express = require('express');
const router = express.Router();
const Academy = require('../models/Academy');

// Get all academies
router.get('/', async (req, res) => {
  try {
    const academies = await Academy.find().sort({ rating: -1 });
    res.json(academies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get one academy by id
router.get('/:id', async (req, res) => {
  try {
    const academy = await Academy.findById(req.params.id);
    if (!academy) return res.status(404).json({ message: 'Academy not found' });
    res.json(academy);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create an academy
router.post('/', async (req, res) => {
  try {
    const academy = await Academy.create(req.body);
    res.status(201).json(academy);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;