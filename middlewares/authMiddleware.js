const jwt = require('jsonwebtoken');
require('dotenv').config();
const access_key = process.env.JWT_ACCESS_SECRET;
const { SuccessHandlerUtil } = require('../utils/success-handler.util');

// Middleware function to verify JWT token
async function verifyToken(req, res, next) {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);

    // Check if token is not provided
    if (!token) {
        return res.status(409).send({ message: "Token not provided" });
    }

    // Verify the token
    jwt.verify(token, access_key, (err, decoded) => {
        if (err) {
            console.error(err);

            // Handle TokenExpiredError
            if (err.name === 'TokenExpiredError') {
                console.log('TokenExpiredError - Token has expired');
                return res.status(409).send({ message: 'Token has expired' });
            }

            // Handle other errors
            console.log('Invalid accessToken:', err.message);
            return res.status(401).send({ message: 'Invalid accessToken' });
        }

        // Attach user ID from the decoded token to the request object
        req.user = { userId: decoded.userId };
        console.log(req.user, 'User ID from token');
        next();
    });
}

// Export the middleware function for use in other parts of the application
module.exports = { verifyToken };
