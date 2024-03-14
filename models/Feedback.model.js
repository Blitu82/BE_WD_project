const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema({
  category: {
    type: String,
    required: [true, 'User category is required.'],
  },
  rating: {
    type: Number,
    required: [true, 'User rating is required.'],
  },
  feedback: String,
  email: {
    type: String,
    required: false,
    trim: true,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Feedback', feedbackSchema);
