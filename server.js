const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
// const Fingerprint2 = require('fingerprintjs2');
const PORT = 8000;
const device = require('express-device');


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
  const truncatedId = base64Encoded.slice(0, 31);
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