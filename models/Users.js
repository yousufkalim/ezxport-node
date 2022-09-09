/**
 * User schema
 * @author Yousuf Kalim
 */
const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    // active: {
    //   type: Boolean,
    //   default: true,
    // },
    email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    zipcode: Number,
    password: {
      type: String,
    },
    city: {
      type: String,
    },
    company: {
      name: { type: String },
      type: { type: String },
      vat: { type: String },
    },
    onboarded: Boolean,
    sellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
      },
    ],
    buyers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buyers',
      },
    ],
    places: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'places',
      },
    ],
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'requests',
      },
    ],
    vendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendors',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('users', userSchema);
