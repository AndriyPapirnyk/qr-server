const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8000;
const Order = require('./models/order');
const User = require('./models//user');

//

const url = 'mongodb+srv://DBproject:ePVJZ6n9U1RWahgN@qr.uduyoii.mongodb.net/?retryWrites=true&w=majority'

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// app.post('/api/user/getAllProducts', async (req, res) => {
//     try{
//         const prodcuts = await Product.find();
//         res.status(200).json(prodcuts);
//       } catch(error){
//         res.status(500).send('Internal Server Error');
//         console.error(error)
//       }
// });


app.post('/api/user/getOrders', async (req, res) => {
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
      } catch(error){
        res.status(500).send('Internal Server Error');
        console.error(error)
      }
});


app.post('/api/user/unacceptedOrder', async (req, res) => {
  try{
    let {orderId,reasonInpData} = req.body;
    await Order.updateOne({_id: orderId}, {refusedReason: reasonInpData, state: 'unaccepted'});

    let orders = await Order.find();
    res.status(200).json(orders);
    } catch(error){
      res.status(500).send('Internal Server Error');
      console.error(error)
    }
});


app.post('/api/user/orderStateChange', async (req, res) => {
  try{
    let orderId = req.body.orderId;
    await Order.updateOne({_id: orderId}, {refusedReason: '', state: 'inProgres'});

    let orders = await Order.find();
    res.status(200).json(orders);
    } catch(error){
      res.status(500).send('Internal Server Error');
      console.error(error)
    }
});


app.post('/api/user/acceptOrder', async (req, res) => {
  try{
    let userId = req.body.userId;
    let user = await User.findOne({_id: userId});
    let userItems = user.items;

    let orderId = req.body._id;
    let order = await Order.findOne({_id: orderId});
    let orderProducts = order.products;

    for(let el of orderProducts){
      let isProductInCart = userItems.some((item) => item._id.toString() === el._id.toString());
      if(isProductInCart){
        let index = userItems.findIndex((item) => item._id.toString() === el._id.toString());
        userItems[index].amount += 1;
      }else{
        el.amount = 0;
        userItems.push(el)
      }
    }

    const dateObj = new Date();
    const month   = dateObj.getUTCMonth() + 1; // months from 1-12
    const day     = dateObj.getUTCDate();
    const year    = dateObj.getUTCFullYear();
    
    const newDate = `${day < 10 ? '0' + day: day}/${month < 10 ? '0' + month: month}/${year}`;

    await User.updateOne({_id: userId}, {items: userItems});
    await Order.updateOne({_id: orderId}, {date: newDate});
    await Order.updateOne({_id: orderId}, {state: 'accepted'});
    const orders = await Order.find();
    
    res.status(200).json(orders);
    } catch(error){
      res.status(500).send('Internal Server Error');
      console.error(error)
    }
});

// app.post('/api/user/saveRequest', async (req, res) => {
//   try{
//     const userId = req.body.userId;
//     const fullPrice = req.body.fullPrice;
//     const productsArr = req.body.cart;
//     let user = await User.findOne({ _id: userId});

//     user.count -= fullPrice;
//     await User.updateOne({_id: userId}, {count: user.count});

//     for(let el of productsArr){
//       let product = await Product.findOne({_id: el._id});
//       product.amount -= 1;
//       await Product.updateOne({_id: el._id}, {amount: product.amount});
//     }

//     allProducts = await Product.find({});

//     const dateObj = new Date();
//     const month   = dateObj.getUTCMonth() + 1; // months from 1-12
//     const day     = dateObj.getUTCDate();
//     const year    = dateObj.getUTCFullYear();

//     const newDate = `${day < 10 ? '0' + day: day}/${month < 10 ? '0' + month: month}/${year}`;

//     const newOrder = new Order({ userId: userId, name: user.name, products: productsArr, totalPrice: fullPrice, date: newDate });
//     await newOrder.save();  

//     res.status(200).send({user:user, products: allProducts});
//   }catch(err){
//     console.log(`You have error: ${err}`)
//   }
// })

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