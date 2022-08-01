/**
 * Calculation schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const calculationSchema = new mongoose.Schema(
  {
    coefficient: String,
    type: {
      type: String,
      enum: ['coefficient', 'range'],
    },
    min_threshold: {
      currency: String,
      value: Number,
    },
    coefficient: String,
    min_cost: {
      currency: String,
      value: Number,
    },
    max_cost: {
      currency: String,
      value: Number,
    },
    range: [
      {
        min: Number,
        max: Number,
        certificate_cost: Number,
      },
    ],
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('calculations', calculationSchema);
