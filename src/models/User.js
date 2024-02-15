const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  kakaoId: { type: Number, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  ssn: { type: String, required: true, unique: true },
  protecter: { type: [String], required: true },
});

module.exports = mongoose.model('User', userSchema);
