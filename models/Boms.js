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
    admin_code: {
      type: Boolean,
      required: true,
    },
    certification_required: {
      type: Boolean,
      required: true,
    },
    countries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'countries' }],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('boms', bomSchema);
