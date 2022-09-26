/**
 * Service Providers schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const vendorSchema = new mongoose.Schema(
  {
    phone_number: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    contact_email: {
      type: String,
      required: true,
    },
    sending_email: {
      type: String,
      required: true,
    },
    countries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'countries' }],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('vendors', vendorSchema);
