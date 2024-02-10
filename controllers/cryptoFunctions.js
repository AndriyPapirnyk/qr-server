const crypto = require('crypto');

const key = crypto.randomBytes(32);
const algorithm = 'aes-256-cbc';

const encryptDeviceId = (deviceId) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(deviceId, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedDeviceId: encrypted };
};

const decryptDeviceId = (encryptedDeviceId, iv) => {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedDeviceId, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encryptDeviceId, decryptDeviceId };
