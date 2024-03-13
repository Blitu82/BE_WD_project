const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema({
  question1: String,
  question2: String,
  question3: String,
  question4: String,
  question5: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Feedback', feedbackSchema);
