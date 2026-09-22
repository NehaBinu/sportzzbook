const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Application = require('../models/Application');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { opportunityId } = req.body;

    const application = await Application.create({
      user: req.userId,
      opportunity: opportunityId,
    });

    res.status(201).json({ message: 'Applied successfully', application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You've already applied to this opportunity" });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;