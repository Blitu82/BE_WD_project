const { Schema, model } = require('mongoose');

const polygonSchema = new Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true,
  },
  coordinates: {
    type: [[[Number]]],
    required: true,
  },
});

const gridSchema = new Schema({
  tile: String,
  location: polygonSchema,
  imgUrl: String,
});

module.exports = model('Grid', gridSchema);
