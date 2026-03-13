const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Order Schema (user optional for guest checkout; guestEmail used instead)
const OrderSchema = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  guestEmail: { type: String, default: null },
  guestFirstName: { type: String, default: null },
  guestLastName: { type: String, default: null },
  guestAddress: { type: String, default: null },
  guestPhone: { type: String, default: null },
  total: {
    type: Number,
    default: 0
  },
  shippingOption: {
    name: { type: String },
    cost: { type: Number, default: 0 },
    deliveryTime: { type: String }
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Order', OrderSchema);
