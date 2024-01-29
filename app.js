// Importing required modules
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

// Importing routers
const authRouter = require('./router/auth.router');
const blogPostRouter = require('./router/blogPost.router');
const commentRouter = require('./router/comment.router');

// Environment variable
const client_URL = process.env.CLIENT_URL;

// Initializing Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan("dev")); // Logging HTTP requests in development mode
app.use(cors({
    origin: client_URL, // Allow requests only from the specified client URL
    methods: 'GET, POST, DELETE, PUT' // Allow specified HTTP methods
}));

// Routing
app.use('/api/auth', authRouter); // Authentication routes
app.use('/api/post', blogPostRouter); // Blog post routes
app.use('/api', commentRouter); // Comment routes

// Exporting the configured Express app
module.exports = app;
