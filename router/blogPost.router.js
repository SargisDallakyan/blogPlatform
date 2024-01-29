const express = require('express');
const blogPostRoute = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controller/blogPost.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

blogPostRoute.get('/posts', getAllPosts);
blogPostRoute.post('/posts', verifyToken, createPost);
blogPostRoute.put('/posts/:_id', verifyToken, updatePost);
blogPostRoute.delete('/posts/:_id', verifyToken, deletePost);


module.exports = blogPostRoute;