/**
 * BOM schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const bomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      //   required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('boms', bomSchema);
