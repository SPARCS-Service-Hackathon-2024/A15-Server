// controllers/userController.js
const User = require('../../models/User');

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 id 추출

    const user = await User.findOne({ id: id });
    console.log("hello");
    if (user) {
      // 사용자가 존재하는 경우, 사용자 정보 반환
      res.status(200).json(user);
    } else {
      // 사용자가 존재하지 않는 경우, 404 Not Found 응답
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
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

exports.addUserInfo = async (req, res) => {
  try {
    const { id } = req.params; // URL 파라미터에서 id 추출
    const { name, ssn, phoneNumber, address } = req.body; // 요청 본문에서 추가 정보 추출

    // 사용자 정보를 업데이트하고, 업데이트된 문서를 반환받습니다.
    const updatedUser = await User.findOneAndUpdate(
      { id: id }, // 찾을 조건
      { $set: { name, ssn, phoneNumber, address } }, // 업데이트할 정보
      { new: true, runValidators: true } // 업데이트된 문서 반환, 입력 검증 실행
    );

    if (updatedUser) {
      // 사용자 정보 업데이트 성공
      res.status(200).json(updatedUser);
    } else {
      // 해당 ID를 가진 사용자가 존재하지 않는 경우
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

