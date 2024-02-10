const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      userId: String,
      name: String,
      count: Number,
      scans: Number,
      lastScan: Date,
      items: [
            {
                name: String,
                img: String,
                price: Number,
                amount: Number,
            }
          ],
      history: Array,
});

module.exports = mongoose.model('User', userSchema);