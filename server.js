const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
// const Fingerprint2 = require('fingerprintjs2');
const PORT = 8000;
const device = require('express-device');
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');


//

const url = 'mongodb+srv://DBproject:ePVJZ6n9U1RWahgN@qr.uduyoii.mongodb.net/?retryWrites=true&w=majority'

const app = express();

app.use(device.capture());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// app.use((req, res, next) => {

//   // const userAgent = req.get('user-agent');

//   Fingerprint2.getPromise().then(components => {
//     const fingerprint = Fingerprint2.x64hash128(components.map(pair => pair.value).join(''), 31);

//     req.deviceId = fingerprint;
//     next();
//   });
// });


app.post('/api/user/getAllProducts', async (req, res) => {
    try{
        const prodcuts = await Product.find();
        res.status(200).json(prodcuts);
      } catch(error){
        res.status(500).send('Internal Server Error');
        console.error(error)
      }
});

app.post('/api/user/saveRequest', async (req, res) => {
  try{
    const userId = req.body.userId;
    const fullPrice = req.body.fullPrice;
    const productsArr = req.body.cart;
    let user = await User.findOne({ _id: userId});

    user.count -= fullPrice;
    await User.updateOne({_id: userId}, {count: user.count});

    for(let el of productsArr){
      let product = await Product.findOne({_id: el._id});
      product.amount -= 1;
      await Product.updateOne({_id: el._id}, {amount: product.amount});
    }

    allProducts = await Product.find({});

    const dateObj = new Date();
    const month   = dateObj.getUTCMonth() + 1; // months from 1-12
    const day     = dateObj.getUTCDate();
    const year    = dateObj.getUTCFullYear();

    const newDate = `${day < 10 ? '0' + day: day}/${month < 10 ? '0' + month: month}/${year}`;

    const newOrder = new Order({ userId: userId, name: user.name, products: productsArr, totalPrice: fullPrice, date: newDate });
    await newOrder.save();  

    res.status(200).send({user:user, products: allProducts});
  }catch(err){
    console.log(`You have error: ${err}`)
  }
})



app.post('/api/user/getUser', async(req, res) => {
  const userAgent = req.headers['user-agent'];
  const deviceId = generateDeviceId(userAgent);
      try{
        const existingUser = await User.findOne({ userId: deviceId });
          res.status(200).send(existingUser)           
      }
      catch(error) {
          console.log(error);
          res.sendStatus(404)
      }
});
// app.get('/', (req, res) => {
//   const userAgent = req.headers['user-agent'];
//   const deviceType = req.device.type;
//   res.send(`User-Agent: ${userAgent}\nDevice Type: ${deviceType}`);
// });

app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const deviceId = generateDeviceId(userAgent);
  req.deviceId = deviceId;
  next();
});

function generateDeviceId(userAgent) {
  const base64Encoded = Buffer.from(userAgent).toString('base64');
  const truncatedId = base64Encoded.slice(18, 38);
  return truncatedId;
}


// mongodb

async function connect() {
    try {  
      await mongoose.connect(url);
      console.log(`Connected to mongodb`);
    } catch (error) {
      console.error(`Connection error: ${error}`);
    }
};

connect();

//

const serverRoutes = require('./routes/routes')
app.use('/api/user', serverRoutes);

//

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});