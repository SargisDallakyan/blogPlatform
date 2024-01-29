const { BlogPost } = require('../model/blogPosts.model');
const { SuccessHandlerUtil } = require('../utils/success-handler.util');

// Function to create a new blog post
async function createPost(req, res) {
    try {
        const { title, body, userId } = req.body;

        // Create a new blog post
        const newPost = new BlogPost({
            title,
            body,
            author: userId
        });

        // Save the new blog post
        await newPost.save();

        // Return success response
        return res.status(201).send({ message: 'Post created successfully' });
    } catch (error) {
        console.log(error);
        // Return error response
        return res.status(500).json({ message: 'Error creating post' });
    }
}

// Function to retrieve all blog posts
async function getAllPosts(req, res) {
    try {
        // Retrieve all blog posts and populate author details
        const posts = await BlogPost.find().populate('author');
        // Return the posts
        return res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        // Return error response
        return res.status(500).json({ message: 'Error retrieving posts' });
    }
}

// Function to update an existing blog post
async function updatePost(req, res) {
    const { userId, title, body } = req.body;
    const { _id } = req.params;
    try {
        // Find the blog post by ID and author
        const post = await BlogPost.findOne({ _id, author: userId });
        if (!post) {
            return res.status(404).send({ message: 'Post not found or user not authorized' });
        }

        // Update the blog post
        post.title = title;
        post.body = body;
        post.updatedAt = new Date();
        await post.save();

        // Return the updated post
        return res.status(200).send(post);
    } catch (error) {
        console.log(error);
        // Return error response
        return res.status(500).json({ message: 'Error updating the post' });
    }
}

// Function to delete a blog post
async function deletePost(req, res) {
    const { _id } = req.params;
    const { userId } = req.body;
    try {
        // Find and delete the blog post by ID and author
        const post = await BlogPost.findOneAndDelete({ _id, author: userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or user not authorized' });
        }

        // Return success response
        return res.status(201).send({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        // Return error response
        return res.status(500).json({ message: 'Error deleting the post' });
    }
}

// Exporting the functions for use in other parts of the application
module.exports = {
    createPost,
    getAllPosts,
    updatePost,
    deletePost
};
