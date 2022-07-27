/**
 * Address Book schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const addressBookSchema = new mongoose.Schema(
  {
    phone: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      lat: String,
      lng: String,
      label: String,
      label2: String,
      city: String,
      postal_code: String,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller'],
    },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('addressbooks', addressBookSchema);
