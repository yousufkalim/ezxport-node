/**
 * PLace schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const placeSchema = new mongoose.Schema(
  {
    phone_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    contact_fname: String,
    contact_lname: String,
    address: String,
    city: String,
    zipcode: Number,
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('places', placeSchema);
