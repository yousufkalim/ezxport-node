/**
 * Countries schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('countries', countrySchema);
