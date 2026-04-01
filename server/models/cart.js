const Mongoose = require('mongoose');

const { CART_ITEM_STATUS } = require('../constants');

const { Schema } = Mongoose;

// Cart Item Schema
const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  purchasePrice: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  priceWithTax: {
    type: Number,
    default: 0
  },
  totalTax: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: CART_ITEM_STATUS.Not_processed,
    enum: [
      CART_ITEM_STATUS.Not_processed,
      CART_ITEM_STATUS.Processing,
      CART_ITEM_STATUS.Shipped,
      CART_ITEM_STATUS.Delivered,
      CART_ITEM_STATUS.Cancelled
    ]
  }
});

module.exports = Mongoose.model('CartItem', CartItemSchema);

// Cart Schema (user optional for guest checkout)
const CartSchema = new Schema({
  products: [CartItemSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  // Checkout / shipping info (saved when user fills checkout form)
  customerFirstName: { type: String, default: null },
  customerLastName: { type: String, default: null },
  customerEmail: { type: String, default: null },
  customerPhone: { type: String, default: null },
  customerAddress: { type: String, default: null },
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

module.exports = Mongoose.model('Cart', CartSchema);
