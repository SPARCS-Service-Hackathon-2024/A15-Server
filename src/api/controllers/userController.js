// controllers/userController.js
const User = require('../../models/User');

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 id 추출

    const user = await User.findOne({ kakaoId: id });
    console.log("hello");
    if (user) {
      // 사용자가 존재하는 경우, 사용자 정보 반환
      res.status(200).json(user);
      console.log("exist")
    } else {
      // 사용자가 존재하지 않는 경우, 404 Not Found 응답
      res.status(404).json({ message: 'User not found.' });
      console.log("not exist")
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editProtecter = async (req, res) => {
  const { id } = req.params;
  const { newProtectorPhoneNumber } = req.body;
  console.log(newProtectorPhoneNumber);

  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      $set: { protecter: newProtectorPhoneNumber }
    }, { new: true });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, kakaoId, imageUrl, name, ssn, phoneNumber, address, protecter } = req.body;

    const existingUser = await User.findOne({ kakaoId });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const user = await User.create({ email, kakaoId, imageUrl, name, ssn, phoneNumber, address, protecter });
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
