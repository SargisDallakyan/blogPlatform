// comment.router.js
const express = require('express');
const router = express.Router();
const { addComment, getCommentsByPost, deleteComment } = require('../controller/comment.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/posts/:postId/comments', getCommentsByPost);
router.post('/posts/:postId/comments', verifyToken, addComment);
router.delete('/comments/:commentId', verifyToken, deleteComment);

module.exports = router;
