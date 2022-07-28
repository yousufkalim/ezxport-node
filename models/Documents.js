/**
 * Document schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    info: {
      type: String,
    },
    countries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'countries' }],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('documents', documentSchema);
