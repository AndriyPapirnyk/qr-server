const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      userId: String,
      name: String,
      count: Number,
      lastScan: Date,
      history: Array,
});

module.exports = mongoose.model('User', userSchema);