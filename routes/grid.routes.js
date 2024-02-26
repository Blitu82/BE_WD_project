const router = require('express').Router();
const Grid = require('../models/Grid.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');

// Create a new grid
router.post('/grid', async (req, res, next) => {
  const { name, location, imgUrl } = req.body;
  try {
    const newGrid = await Grid.create({
      name,
      location,
      imgUrl,
    });
    console.log('New grid', newGrid);
    res.status(201).json(newGrid);
  } catch (error) {
    console.log('An error occurred creating the grid', error);
    next(error);
  }
});

// Get all grids
router.get('/grid', async (req, res, next) => {
  try {
    const allGrids = await Grid.find();
    console.log(allGrids);
    res.json(allGrids);
  } catch (error) {
    console.log('An error occurred getting all the grids', error);
    next(error);
  }
});

// Send bathy data to Cloudinary and return the URL
router.post('/upload', fileUploader.single('imgUrl'), (req, res) => {
  try {
    res.status(200).json({ imgUrl: req.file.path });
  } catch (error) {
    console.log('An error occurred uploading the bathymetry', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
