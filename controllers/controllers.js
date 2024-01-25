const User = require('../models/user');

//
exports.test = async (req, res) => {
  res.send('it is server')
}

exports.verifyUser = async (req, res) => {
  try {
    console.log(req.deviceId);

    const existingUser = await User.findOne({ userId: req.deviceId });
    const today = new Date().setHours(0, 0, 0, 0);

    if (existingUser) {
      console.log('User exists:', existingUser);
      if(existingUser.lastScan && existingUser.lastScan.getTime() >= today) {
        res.status(200).send('User has already scaned today', existingUser.name)
      }

      existingUser.lastScan = new Date();
      existingUser.count = (existingUser.count || 1) + 1;
      res.status(200).send(true);
    } else {
      res.status(200).send(false)
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.createUser = async(req, res) => {
  try{
    const currentDate = new Date();
      
    const newUser = new User({ userId: req.deviceId, name: "test", count: 1, lastScan: currentDate  });
    await newUser.save();      
    console.log('User created:', newUser);
    res.status(200).send(false);
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


