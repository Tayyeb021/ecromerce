const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Shipping Option Schema
const ShippingOptionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    default: 0
  },
  deliveryTime: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  freeShippingThreshold: {
    type: Number,
    default: null // null means this option doesn't support free shipping
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('ShippingOption', ShippingOptionSchema);
