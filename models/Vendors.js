/**
 * Service Providers schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const vendorSchema = new mongoose.Schema(
  {
    phone: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
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
