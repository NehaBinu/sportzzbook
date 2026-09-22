const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Athlete', 'Coach'], default: 'Athlete' },
  sport: { type: String, default: '' },
  position: { type: String, default: '' },
  city: { type: String, default: '' },
  college: { type: String, default: '' },
  avatar: { type: String, default: '' },
  stats: {
    achievements: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    awards: { type: Number, default: 0 },
  },
  skills: [{ type: String }],
  resume: [{
    medal: { type: String, enum: ['gold', 'silver', 'trophy'] },
    title: String,
    year: String,
  }],
  about: { type: String, default: '' },
  contact: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);