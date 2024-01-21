const User = require('../models/user');

//
exports.test = async (req, res) => {
  res.send('it is server')
}

exports.getUser = async (req, res) => {
  try {
    console.log(req.deviceId);

    const existingUser = await User.findOne({ userId: req.deviceId });

    if (existingUser) {
      console.log('User exists:', existingUser);
      res.status(200).send(true);
      console.log("exist");
    } else {
      const currentDate = new Date();
      
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      
      const formattedDateTime = `${year}.${month}.${day}.${hours}.${minutes}`;


      const newUser = new User({ userId: req.deviceId, name: "test", count: 1, lastScan: formattedDateTime  });
      await newUser.save();
      console.log('User created:', newUser);
      res.status(200).send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


