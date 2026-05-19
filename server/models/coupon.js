const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  value: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: null },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  expiryDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Coupon', CouponSchema);
