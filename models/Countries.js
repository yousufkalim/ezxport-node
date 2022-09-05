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
    currency: String,
    vendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendors',
      },
    ],
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'documents',
      },
    ],
    boms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'boms',
      },
    ],
    calculation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'calculations',
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('countries', countrySchema);
