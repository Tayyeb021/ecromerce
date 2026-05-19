const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const SettingSchema = new Schema({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: String, trim: true, default: '' },
  updated: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Setting', SettingSchema);
