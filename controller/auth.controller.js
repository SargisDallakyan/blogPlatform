require('dotenv').config();
const { Users } = require('../model/auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const refresh_pass = process.env.JWT_REFRESH_SECRET;
const access_key = process.env.JWT_ACCESS_SECRET;
const access_time = process.env.ACCESS_TOKEN_ACTIVE_TIME;
const refresh_time = process.env.REFRESH_TOKEN_ACTIVE_TIME;
const { SuccessHandlerUtil } = require('../utils/success-handler.util');

// Function to register a new user
async function registerUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(409).send({ errors: errors.array() });

    const { name, surname, email, username, password, role } = req.body;

    // Check if username already exists
    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return res.status(409).send({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Create a new user
    const newUser = new Users({
      name,
      surname,
      email,
      username,
      password: hashedPassword,
      role: role || 'user'
    });

    // Save the new user
    await newUser.save();
    return res.send({ message: 'User inserted', data: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Function to handle user login
async function userLogin(req, res) {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(409).send({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Return the tokens and user role
    return res.status(200).send({ username, accessToken, refreshToken, role: user.role });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error logging in' });
  }
}

// Function to handle user logout
async function logoutUser(req, res) {
  const token = req.headers.authorization;
  const blacklistedTokens = new Set();

  if (!token) {
    return res.status(401).send({ message: 'Token not provided' });
  }

  const tokenValue = token.split(' ')[1];

  // Add the token to the blacklisted tokens set
  blacklistedTokens.add(tokenValue);

  return res.status(200).send({ message: 'Logout successful' });
}

// Function to view user account details
async function viewAccount(req, res) {
  try {
    // Find the user by user ID and exclude the password field
    const user = await Users.findById(req.userId).select('-password');
    if (!user) return res.status(404).send({ message: 'User not found' });
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Function to update user account details
async function updateAccount(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { userId } = req.params;
    const { name, surname, email, username, password } = req.body;

    // Find the user by ID
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.email = email || user.email;
    user.username = username || user.username;

    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save the updated user
    await user.save();

    // Return success response
    res.json({ message: "User details updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user details" });
  }
}

// Function to verify and refresh an access token
async function verifyRefreshToken(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(401).send({ message: 'Invalid or missing token' });
  }
  try {
    // Verify the refresh token and generate a new access token
    const user = jwt.verify(token, refresh_pass);
    const newAccessToken = generateAccessToken(user);
    return res.status(200).send({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Invalid token' });
  }
}

// Function to generate an access token
function generateAccessToken(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role
  }
  return jwt.sign(payload, access_key, { expiresIn: access_time });
}

// Function to generate a refresh token
function generateRefreshToken(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role
  }
  return jwt.sign(payload, refresh_pass, { expiresIn: refresh_time });
}

// Middleware function to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(401).send({ message: "Access denied: Admin only" });
  }
  next();
}

// Exporting the functions and middleware for use in other parts of the application
module.exports = {
  registerUser,
  userLogin,
  logoutUser,
  viewAccount,
  updateAccount,
  verifyRefreshToken,
  isAdmin
};
