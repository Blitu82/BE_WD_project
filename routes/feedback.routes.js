const router = require('express').Router();
const Feedback = require('../models/Feedback.model');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');

// Create a new feedback
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

// // Get all feedbacks
// router.get('/feedback', async (req, res, next) => {
//   try {
//     const allFeedbacks = await Feedback.find();
//     // console.log(allGrids);
//     res.json(allFeedbacks);
//   } catch (error) {
//     console.log('An error occurred getting all the feedbacks', error);
//     next(error);
//   }
// });

// // Get feedback by user
// router.get('/feedback/:id', async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Id is not valid' });
//     }
//     const feedback = await Feedback.findById(id);

//     // check if id exists in the database before sending the project data
//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
//     res.json(feedback);
//   } catch (error) {
//     console.log('An error occurred getting the feedback', error);
//     next(error);
//   }
// });

// // Update grid by ID
// router.put('/grid/:id', async (req, res, next) => {
//   const { id } = req.params;
//   const { name, location, imgUrl } = req.body;
//   try {
//     // check if id is a valid value
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Id is not valid' });
//     }
//     const updatedGrid = await Grid.findByIdAndUpdate(
//       id,
//       {
//         name,
//         location,
//         imgUrl,
//       },
//       {
//         new: true,
//       }
//     );

//     // check if id exists in the database before sending the project data
//     if (!updatedGrid) {
//       return res.status(404).json({ message: 'Grid not found' });
//     }
//     res.json(updatedGrid);
//   } catch (error) {
//     console.log('An error occurred updating the grid', error);
//     next(error);
//   }
// });

// // Delete grid by ID
// router.delete('/grid/:id', async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     // check if id is a valid value
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Id is not valid' });
//     }
//     await Grid.findByIdAndDelete(id);
//     // await Task.deleteMany({ project: id });

//     res.json({ message: 'Grid deleted successfully' });
//   } catch (error) {
//     console.log('An error occurred deleting the grid', error);
//     next(error);
//   }
// });

module.exports = router;
