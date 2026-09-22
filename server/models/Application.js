const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
}, { timestamps: true });

// Prevent the same user applying to the same opportunity twice
applicationSchema.index({ user: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);