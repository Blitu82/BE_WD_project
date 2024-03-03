const router = require('express').Router();
const Grid = require('../models/Grid.model');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const fileUploader = require('../config/cloudinary.config');
const axios = require('axios');
const { parseString } = require('xml2js');

// Function to read all the geojson files in a directory
// function readGeoJsonFile(directoryPath) {
//   return fs
//     .readdirSync(directoryPath)
//     .filter(file => path.extname(file) === '.geojson');
// }

// // Function to read geojson content from a file
// function readGeoJsonFile(filePath) {
//   return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
// }

router.get('/download', async (req, res) => {
  try {
    // Example GetCoverage request in XML format
    const getCoverageXML = `<?xml version="1.0" encoding="UTF-8"?>
    <GetCoverage version="1.1.1" service="WCS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wcs/1.1.1" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xsi:schemaLocation="http://www.opengis.net/wcs/1.1.1 http://schemas.opengis.net/wcs/1.1.1/wcsAll.xsd">
      <ows:Identifier>ironhack:geotiffs</ows:Identifier>
      <DomainSubset>
        <ows:BoundingBox crs="urn:ogc:def:crs:EPSG::4326">
          <ows:LowerCorner>29.241666666666656 -29.362500000000015</ows:LowerCorner>
          <ows:UpperCorner>42.791666666666664 -7.358333333333343</ows:UpperCorner>
        </ows:BoundingBox>
      </DomainSubset>
      <Output store="true" format="image/tiff">
        <GridCRS>
          <GridBaseCRS>urn:ogc:def:crs:EPSG::4326</GridBaseCRS>
          <GridType>urn:ogc:def:method:WCS:1.1:2dSimpleGrid</GridType>
          <GridOffsets>0.0041666666666666675 -0.004166666666666669</GridOffsets>
          <GridCS>urn:ogc:def:cs:OGC:0.0:Grid2dSquareCS</GridCS>
        </GridCRS>
      </Output>
    </GetCoverage>`;

    // Make a POST request to GeoServer's WCS endpoint
    const response = await axios.post(
      'http://localhost:8080/geoserver/wcs?',
      getCoverageXML,
      {
        headers: {
          'Content-Type': 'application/xml',
        },
        responseType: 'text', // Change responseType to text
      }
    );

    // Parse the XML response to extract the download link
    parseString(response.data, { explicitArray: false }, (err, result) => {
      if (err) {
        throw new Error('Error parsing XML response');
      }

      // Accessing the download link
      const downloadLink =
        result['wcs:Coverages']['wcs:Coverage']['ows:Reference']['$'][
          'xlink:href'
        ];

      // Send the download link to the frontend
      res.json({ downloadLink });
      console.log(downloadLink);
    });
  } catch (error) {
    console.log('An error occurred while getting the coverage:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Create a new grid
router.post('/grid', async (req, res, next) => {
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
    // console.log(allGrids);
    res.json(allGrids);
  } catch (error) {
    console.log('An error occurred getting all the grids', error);
    next(error);
  }
});

// Get grid by ID
router.get('/grid/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const grid = await Grid.findById(id);

    // check if id exists in the database before sending the project data
    if (!grid) {
      return res.status(404).json({ message: 'Grid not found' });
    }
    res.json(grid);
  } catch (error) {
    console.log('An error occurred getting the grid', error);
    next(error);
  }
});

// Update grid by ID
router.put('/grid/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, location, imgUrl } = req.body;
  try {
    // check if id is a valid value
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const updatedGrid = await Grid.findByIdAndUpdate(
      id,
      {
        name,
        location,
        imgUrl,
      },
      {
        new: true,
      }
    );

    // check if id exists in the database before sending the project data
    if (!updatedGrid) {
      return res.status(404).json({ message: 'Grid not found' });
    }
    res.json(updatedGrid);
  } catch (error) {
    console.log('An error occurred updating the grid', error);
    next(error);
  }
});

// Delete grid by ID
router.delete('/grid/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    // check if id is a valid value
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    await Grid.findByIdAndDelete(id);
    // await Task.deleteMany({ project: id });

    res.json({ message: 'Grid deleted successfully' });
  } catch (error) {
    console.log('An error occurred deleting the grid', error);
    next(error);
  }
});

// Upload bathy data to Cloudinary and return the URL
router.post('/upload', fileUploader.single('imgUrl'), (req, res) => {
  try {
    res.status(200).json({ imgUrl: req.file.path });
  } catch (error) {
    console.log('An error occurred uploading the bathymetry', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Download bathy data from Cloudinary and return the URL
// router.get('/upload', fileUploader.single('imgUrl'), (req, res) => {
//   try {
//     res.status(200).json({ imgUrl: req.file.path });
//   } catch (error) {
//     console.log('An error occurred uploading the bathymetry', error);
//     res.status(500).json({ message: 'An error occurred' });
//   }
// });

module.exports = router;
