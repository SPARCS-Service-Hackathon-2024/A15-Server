const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 댓글 작성
router.post('/:postId', commentController.createComment);

// 특정 게시글의 댓글 목록 조회
router.get('/:postId', commentController.getCommentsByPost);

// 댓글 수정
router.patch('/:id', commentController.updateComment);

// 댓글 삭제
router.delete('/:id', commentController.deleteComment);

module.exports = router;
