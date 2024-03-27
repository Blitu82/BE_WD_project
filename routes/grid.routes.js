const router = require('express').Router();
const Grid = require('../models/Grid.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');
const axios = require('axios');
const { parseString } = require('xml2js');
const fs = require('fs');
const path = require('path');

// Create a new grids using the files in the data/geojson folder
router.post('/grid', async (req, res, next) => {
  try {
    // Handle file processing here
    const dataPath = path.join(__dirname, '..', 'data', 'geojson');
    const files = fs.readdirSync(dataPath);
    files.forEach(function (file) {
      if (path.extname(file) === '.geojson') {
        const filePath = path.join(dataPath, file);
        const fileName = path.parse(file).name;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const fileJson = JSON.parse(fileContent);

        Grid.create({
          tile: fileName,
          location: fileJson,
          imgUrl: 'test',
        })
          .then(newGrid => {
            console.log('New grid', newGrid);
          })
          .catch(error => {
            console.log('An error occurred creating the grid', error);
          });
      }
    });
    res.status(201).json({ message: 'Grids created successfully' });
  } catch (error) {
    console.log('An error occurred processing the grids', error);
    next(error);
  }
});

// Create a new grid
// router.post('/grid', async (req, res, next) => {
//   const { tile, location, imgUrl } = req.body;
//   try {
//     const newGrid = await Grid.create({
//       tile,
//       location,
//       imgUrl,
//     });
//     console.log('New grid', newGrid);
//     res.status(201).json(newGrid);
//   } catch (error) {
//     console.log('An error occurred creating the grid', error);
//     next(error);
//   }
// });

router.get('/download', async (req, res) => {
  const { minLat, minLng, maxLat, maxLng } = req.query;
  try {
    // GeoServer GetCoverage request in XML format
    const getCoverageXML = `<?xml version="1.0" encoding="UTF-8"?>
    <GetCoverage version="1.1.1" service="WCS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wcs/1.1.1" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xsi:schemaLocation="http://www.opengis.net/wcs/1.1.1 http://schemas.opengis.net/wcs/1.1.1/wcsAll.xsd">
      <ows:Identifier>ironhack:geotiffs</ows:Identifier>
      <DomainSubset>
        <ows:BoundingBox crs="urn:ogc:def:crs:EPSG::4326">
          <ows:LowerCorner>${minLat} ${minLng}</ows:LowerCorner>
          <ows:UpperCorner>${maxLat} ${maxLng}</ows:UpperCorner>
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
      // 'http://localhost:8080/geoserver/wcs?', // local version
      'http://ec2-13-53-199-118.eu-north-1.compute.amazonaws.com:8080/geoserver/wcs?', // AWS version

      getCoverageXML,
      {
        headers: {
          'Content-Type': 'application/xml',
        },
        responseType: 'text',
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
    });
  } catch (error) {
    console.log('An error occurred while getting the coverage:', error);
    res.status(500).json({ message: 'An error occurred' });
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

// Function to read all the geojson files in a directory
function readGeoJsonFile(directoryPath) {
  return fs
    .readdirSync(directoryPath)
    .filter(file => path.extname(file) === '.geojson');
}

module.exports = router;
