const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  birthdate: { type: Date, required: true },
  role: { type: String, default: 'user' }, // 'user' o 'admin'
  points: { type: Number, default: 0 }, // LevelUp points
  referredBy: { type: String, default: null },
  addresses: [{
    alias: String, // "Casa", "Trabajo"
    address: String,
    city: String,
    region: String,
    zip: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);