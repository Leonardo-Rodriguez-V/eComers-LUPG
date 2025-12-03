const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: String,
  category: String,
  name: String,
  description: String,
  price: Number,
  images: [String],
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String }]
}, { timestamps: true });

// Índices para optimizar queries
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ code: 1 });

module.exports = mongoose.model('Product', productSchema);