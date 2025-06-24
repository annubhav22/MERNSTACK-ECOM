const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true, unique: true },
});

brandSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

brandSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = mongoose.model('Brand', brandSchema);
