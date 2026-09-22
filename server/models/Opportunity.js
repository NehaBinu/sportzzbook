const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  org: { type: String, required: true },
  sport: { type: String, required: true },
  city: { type: String, required: true },
  day: { type: String, required: true },
  month: { type: String, required: true },
  date: { type: String, required: true },
  details: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);