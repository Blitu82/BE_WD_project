const router = require('express').Router();
const Feedback = require('../models/Feedback.model');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');

// POST /api/feedback - Allows a user to send a feedback form
router.post('/feedback', async (req, res, next) => {
  try {
    const { category, rating, feedback, email } = req.body;
    console.log(req.body);
    const newFeedback = await Feedback.create({
      category,
      rating,
      feedback,
      email,
    });
    console.log('New feedback', newFeedback);
    res.status(201).json(newFeedback);
  } catch (error) {
    console.log('An error occurred storing the user feedback', error);
    next(error);
  }
});

module.exports = router;
