
const mongoose = require("mongoose");

// Blog Post Schema
const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    comments: [{
        text: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', postSchema);

module.exports = { BlogPost }