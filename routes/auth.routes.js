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

    //***********************
    // Use regex to validate the email format.
    // const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;

    // if (!emailRegex.test(email)) {
    //   return res.status(400).json({ message: 'Provide a valid email address' });
    // }

    // Use regex to validate the password format.
    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({
    //     message:
    //       'Password must have at least 6 characters and contain one number, one lowercase, one uppercase and one special character.',
    //   });
    // }
    //***********************

    // Check if a user with the same email already exists.
    const userExists = await User.findOneAndDelete({ email });

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

// POST /auth/login - Verifies email and password and returns a JWT
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

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    // If password is correct, create a new JWT with the user data as the
    // payload. Do not send the hashed password in the token.
    if (isPasswordCorrect) {
      const payload = { _id: user._id, email: user.email };
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256', // algorithm to encrypt the token with
        expiresIn: '6h', // time to live of the JWT
      });

      res.status(200).json({ authToken });
    } else {
      return res.status(401).json({ message: 'Unable to authenticate user' });
    }
  } catch (error) {
    console.log('An error occurred login in the user', error);
    next(error);
  }
});

// This route receives a request that must have the JWT in the
// headers. Upon
router.get('/verify', isAuthenticated, (req, res, next) => {
  //if the jwt is valid, the payload gets decoded by the middleware
  // and is made available in req.payload
  // The route will send the user data stored in the payload of the JWT
  res.json(req.payload);
});

module.exports = router;
