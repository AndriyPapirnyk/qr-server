const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
      name: String,
      userId: String,
      date: String,
      products: [
        {
            name: String,
            img: String,
            price: Number
        }
      ],
      totalPrice: Number
});

module.exports = mongoose.model('Order', orderSchema);