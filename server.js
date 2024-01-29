// Importing required modules
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const http = require('http');
const app = require('./app');

// Load environment variables from .env file
dotenv.config();

// Configuration
const PORT = process.env.PORT;
const mongo_URL = process.env.DB_URL;

// Create an HTTP server with the Express app
http.createServer(app);

// Connect to MongoDB
mongoose.connect(mongo_URL)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(error => console.log("Connection error --->>", error));

// Start the Express app and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
