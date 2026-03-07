const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Banner Schema
const BannerSchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Banner', BannerSchema);
