const User = require('../models/user');
const Product = require('../models/product');

//
exports.test = async (req, res) => {
  res.send(req.deviceId)
}

// exports.verifyUser = async (req, res) => {
//   try {
//     console.log(req.deviceId);

//     const existingUser = await User.findOne({ userId: req.deviceId });
//     const today = new Date().setHours(0, 0, 0, 0);

//     if (existingUser) {
//       console.log('User exists:', existingUser);
//       if(existingUser.lastScan && existingUser.lastScan.getTime() >= today) {
//         res.status(200).send({user: existingUser, scanned: true})
//       } else {
//         existingUser.lastScan = new Date();
//         existingUser.count = (existingUser.count || 1) + 1;
//         res.status(200).send({user: existingUser, scanned: false})
//       }
//     } else {
//       res.status(200).send({user: false, scanned: true})
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

exports.verifyUser = async (req, res) => {
  try {
    const userId = req.body.deviceId;
    console.log(userId);
    console.log(1)

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


exports.createUser = async(req, res) => {
  try{
    const name = req.body.name;
    const deviceId = req.body.deviceId;
    console.log(name)
    const currentDate = new Date();
      
    const newUser = new User({ userId: deviceId, name: name, count: 1, lastScan: currentDate, history: [currentDate]  });
    await newUser.save();      
    console.log('User created:', newUser);
    res.status(200).send({user: newUser});
  } catch(error) {
    console.error(error)
  }
}

exports.getAllUsers = async(req, res) => {
  try{
    const users = await User.find();
    res.status(200).json(users)
  } catch(error){
    console.error(error)
  }
}


// exports.getAllProducts = async(req, res) => {
//   try{
//     const prodcuts = await Product.find();
//     res.status(200).json(prodcuts)
//   } catch(error){
//     res.status(500).send('Internal Server Error');
//     console.error(error)
//   }
// }


exports.getCount = async(req, res) => {
  try{
      const result = await User.aggregate([
        {
          $group: {
            _id: null,
            totalCount: { $sum: "$count" }
          }
        }
      ]);
  
      const totalCount = result.length > 0 ? result[0].totalCount : 0;
      res.status(200).json({ totalCount });
  } catch(error){
    console.error(error)
  }
}


