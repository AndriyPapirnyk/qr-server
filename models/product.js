const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
      name: String,
      amount: Number,
      img: String,
      price: Number
});

module.exports = mongoose.model('Product', productSchema);