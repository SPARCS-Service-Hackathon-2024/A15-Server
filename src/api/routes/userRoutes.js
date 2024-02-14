// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 사용자 정보 저장 API 라우트
router.post('/users', userController.createUser);

module.exports = router;
