const mongoose = require('mongoose'); // ✅ Must be spelled correctly
const { Schema } = mongoose;

const categorySchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true, unique: true },
});

categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

const Category = mongoose.model('Category', categorySchema); // ✅ Fixed
module.exports = Category;

