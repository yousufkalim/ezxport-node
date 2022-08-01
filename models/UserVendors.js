/**
 * Service Providers schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const userVendorSchema = new mongoose.Schema(
  {
    contact_fname: String,
    contact_lname: String,
    contact_email: String,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'vendors' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('user_vendors', userVendorSchema);
