// models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, min: 0, max: 10000 },
  discountPercentage: { type: Number, min: 0, max: 99 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  stock: { type: Number, min: 0, default: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  colors: { type: [Schema.Types.Mixed] },
  sizes: { type: [Schema.Types.Mixed] },
  highlights: { type: [String] },
  discountPrice: { type: Number },
  deleted: { type: Boolean, default: false },
});

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

// ✅ Correct way to export
module.exports = mongoose.model('Product', productSchema);
