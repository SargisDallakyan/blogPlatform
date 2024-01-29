const { body } = require('express-validator');

// Validation rules for user input
const userValidation = [
  // Validate the 'name' field
  body('name')
    .not().isEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .isAlpha('en-US', { ignore: ' -' }).withMessage('Name must contain only letters, spaces, or dashes'),

  // Validate the 'surname' field
  body('surname')
    .not().isEmpty().withMessage('Surname is required')
    .isLength({ min: 2 }).withMessage('Surname must be at least 2 characters long')
    .isAlpha('en-US', { ignore: ' -' }).withMessage('Surname must contain only letters, spaces, or dashes'),

  // Validate the 'email' field
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(), // Normalize the email address

  // Validate the 'username' field
  body('username')
    .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),

  // Validate the 'password' field
  body('password')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),

  // Validate the 'role' field
  body('role')
    .isIn(['admin', 'user']).withMessage('Invalid user role'),
];

// Exporting the user validation rules
module.exports = { userValidation };
