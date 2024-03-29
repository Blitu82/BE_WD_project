const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const User = require('../models/User.model');

const saltRounds = 10;

// POST /auth/ signup - Creates a new user in the database.
router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if the email or password is provided as an empty string
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'Provide email and password.' });
    }

    // Use regex to validate the email format.
    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Provide a valid email address' });
    }

    // Use regex to validate the password format.
    const passwordRegex =
      /^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/gm;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password should be at least one capital letter, one small letter, one number and 8 character length.',
      });
    }

    // Check if a user with the same email already exists.
    const userExists = await User.findOne({ email });

    // If a user with the same email already exists, send an error response
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // If the user is unique, proceed to hash the password.
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user in the database.
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Deconstruct the newly created user to omit the password.
    // Send a json response containing the user object.
    res.status(201).json({ email: newUser.email, _id: newUser._id });
  } catch (error) {
    console.log('Error creating the user', error);
    next(error);
  }
});

// POST /auth/login - Verifies email and password and returns a JWT.
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email or password are provided as empty string
  try {
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'Provide email and password.' });
    }

    // Check the users collection if a user with the same email exists
    const user = await User.findOne({ email });

    if (!user) {
      // If the user is not found, send an error message
      return res.status(401).json({ message: 'User not found.' });
    }

    // Commpare the provided password with the one saved in the database
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    // If password is correct, create a new JWT with the user data as the
    // payload. Do not send the hashed password in the token.
    if (isPasswordCorrect) {
      // Deconstruct the user object to omit the password
      // Create an object that will be set as the token payload.
      const payload = { _id: user._id, email: user.email };

      // Create and sign the token
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256', // algorithm to encrypt the token with
        expiresIn: '6h', // time to live of the JWT
      });

      // Send the token as the response.
      res.status(200).json({ authToken });
    } else {
      return res.status(401).json({ message: 'Unable to authenticate user' });
    }
  } catch (error) {
    console.log('An error occurred login in the user', error);
    next(error);
  }
});

// GET /auth/verify - Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {
  //If the JWT token is valid, the payload gets decoded by the isAuthenticated middleware
  // and is made available on 'req.payload'.
  // The route will send the user data stored in the payload of the JWT
  res.status(200).json(req.payload);
});

// POST /auth/change-password - Allows a user to change their password
router.post('/change-password', async (req, res, next) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect old password.' });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    // Send a success response
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.log('Error changing password', error);
    next(error);
  }
});

module.exports = router;
