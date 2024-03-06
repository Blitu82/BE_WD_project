const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
  },
  {
    // this second object adds extra properties 'createdAt' and 'updatedAt'
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
