const mongoose = require('mongoose');

const academySchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  city: { type: String, required: true },
  rating: { type: Number, default: 0 },
  coaches: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  about: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Academy', academySchema);