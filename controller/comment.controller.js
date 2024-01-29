const Comment = require('../model/comment.model');
const BlogPost = require('../model/blogPosts.model');
const { SuccessHandlerUtil } = require('../utils/success-handler.util');

// Function to add a comment to a blog post
async function addComment(req, res) {
    try {
        const { postId } = req.params;
        const { text } = req.body;

        // Check if the associated blog post exists
        const postExists = await BlogPost.findById(postId);
        if (!postExists) {
            return res.status(404).send({ message: 'Blog post not found' });
        }

        // Create a new comment
        const newComment = new Comment({
            text,
            author: req.userId,
            post: postId
        });

        // Save the new comment
        await newComment.save();
        return res.status(201).send(newComment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding comment' });
    }
}

// Function to get comments for a specific blog post
async function getCommentsByPost(req, res) {
    try {
        const { postId } = req.params;

        // Retrieve comments for the specified blog post and populate author details
        const comments = await Comment.find({ post: postId }).populate('author', 'username');
        return res.status(200).send(comments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error retrieving comments' });
    }
}

// Function to delete a comment
async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);

        // Check if the comment exists
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        // Check if the user is authorized to delete the comment
        if (comment.author.toString() !== req.userId) {
            return res.status(403).send({ message: 'Not authorized to delete this comment' });
        }

        // Remove the comment
        await comment.remove();
        return res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error deleting comment' });
    }
}

// Exporting the functions for use in other parts of the application
module.exports = {
    addComment,
    getCommentsByPost,
    deleteComment
};
