const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const { encryptDeviceId, decryptDeviceId } = require('./cryptoFunctions');


//

exports.verifyUser = async (req, res) => {
  try {
    const userId = req.body.deviceId;

    const existingUser = await User.findOne({ userId: userId });
    const currentTime = new Date();
    const today = new Date(currentTime).setHours(0, 0, 0, 0);

    if (existingUser) {
      console.log('User exists:', existingUser);

      if (existingUser.lastScan && existingUser.lastScan.getTime() >= today) {
        res.status(200).send({ user: existingUser, scanned: true });
      } else {
        const formattedTime = currentTime.toLocaleDateString('en-GB'); 
        existingUser.lastScan = currentTime;
        existingUser.history.push(formattedTime);
        existingUser.count = (existingUser.count || 0) + 1;
        existingUser.scans = (existingUser.scans || 0) + 1;

        await existingUser.save();

        res.status(200).send({ user: existingUser, scanned: false });
      }
    } else {
      res.status(200).send({ user: false, scanned: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


// exports.createUser = async(req, res) => {
//   try{
//     const name = req.body.name;
//     const deviceId = req.body.deviceId;
//     console.log(name);
//     console.log(deviceId);
//     const currentDate = new Date();
      
//     const newUser = new User({ userId: deviceId, name: name, scans: 1, count: 1, lastScan: currentDate, history: [currentDate], items: []  });
//     await newUser.save();      
//     console.log('User created:', newUser);
//     res.status(200).send({user: newUser});
//   } catch(error) {
//     console.error(error)
//   }
// }

exports.createUser = async (req, res) => {
  try {
    const name = req.body.name;
    const deviceId = req.body.deviceId;

    // Шифруємо deviceId перед збереженням в базу даних
    const { iv, encryptedDeviceId } = encryptDeviceId(deviceId);

    console.log(name);
    console.log('Encrypted Device ID:', encryptedDeviceId);

    const currentDate = new Date();
      
    const newUser = new User({
      userId: encryptedDeviceId, // Зберігаємо зашифрований deviceId
      name: name,
      scans: 1,
      count: 1,
      lastScan: currentDate,
      history: [currentDate],
      items: []
    });
    
    await newUser.save();      
    console.log('User created:', newUser);

    // Розшифровуємо айді перед надсиланням відповіді
    const decryptedDeviceId = decryptDeviceId(newUser.userId, iv);

    // Надсилаємо відповідь, включаючи розшифрований айді
    res.status(200).send({ user: { ...newUser.toObject(), userId: decryptedDeviceId } });
  } catch(error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
}



// exports.getAllUsers = async(req, res) => {
//   try{
//     const users = await User.find();
//     res.status(200).json(users)
//   } catch(error){
//     console.error(error)
//   }
// }

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Розшифровуємо userId кожного користувача перед відправленням відповіді
    const decryptedUsers = users.map(user => {
      const decryptedUserId = decryptDeviceId(user.userId, user.iv);
      return { ...user.toObject(), userId: decryptedUserId };
    });

    res.status(200).json(decryptedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
}


exports.getAllProducts = async(req, res) => {
  try{
    const prodcuts = await Product.find();
    res.status(200).json(prodcuts);
  } catch(error){
    res.status(500).send('Internal Server Error');
    console.error(error)
  }
}


exports.getCount = async(req, res) => {
  try{
      const result = await User.aggregate([
        {
          $group: {
            _id: null,
            totalCount: { $sum: "$scans" }
          }
        }
      ]);
  
      const totalCount = result.length > 0 ? result[0].totalCount : 0;
      res.status(200).json({ totalCount });
  } catch(error){
    console.error(error)
  }
}

// exports.saveRequest = async(req, res) => {
//   try{
//     console.log('dadasd')
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

//     const newOrder = new Order({ userId: userId, name: user.name, products: productsArr, totalPrice: fullPrice, date: newDate, state: 'inProgres' });
//     await newOrder.save();  

//     res.status(200).send({user:user, products: allProducts});
//   } catch(error) {
//     console.error(error)
//   }
// }

exports.saveRequest = async (req, res) => {
  try {
    console.log('dadasd');
    const userId = req.body.userId;
    const fullPrice = req.body.fullPrice;
    const productsArr = req.body.cart;

    // Шифруємо userId перед пошуком користувача в базі даних
    const { iv, encryptedUserId } = encryptDeviceId(userId);

    let user = await User.findOne({ userId: encryptedUserId });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Розшифровуємо userId перед оновленням кількості товарів користувача
    const decryptedUserId = decryptDeviceId(user.userId, iv);

    user.count -= fullPrice;
    await User.updateOne({ userId: encryptedUserId }, { count: user.count });

    for (let el of productsArr) {
      let product = await Product.findOne({ _id: el._id });
      product.amount -= 1;
      await Product.updateOne({ _id: el._id }, { amount: product.amount });
    }

    allProducts = await Product.find({});

    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const newDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

    const newOrder = new Order({ userId: decryptedUserId, name: user.name, products: productsArr, totalPrice: fullPrice, date: newDate, state: 'inProgres' });
    await newOrder.save();

    res.status(200).send({ user: user, products: allProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
}




