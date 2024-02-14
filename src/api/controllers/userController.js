// controllers/userController.js
const User = require('../../models/User');

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, id } = req.body;

    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    
    const user = await User.create({ email, id });
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
