const Comment = require('../../models/Comment');

// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    const newComment = new Comment({ postId, userId, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating comment', error: error.message });
  }
};

// 특정 게시글의 댓글 목록 조회
exports.getCommentsByPost = async (req, res) => {
  try {
    console.log("hello2");
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).populate('userId', 'username');
    console.log(comments);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(req.params.id, { content }, { new: true });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating comment', error: error.message });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
