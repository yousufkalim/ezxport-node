/**
 * Product schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const productSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'requests' },
    code: { type: mongoose.Schema.Types.ObjectId, ref: 'boms' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    country: String,
    name: String,
    status: String,
    description: String,
    condition: String,
    amount: Number,
    unit: String,
    price: { currency: String, value: String },
    mark: String,
    builder: String,
    technical_sheet: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent', enum: ['Sent', 'Valid', 'Invalid'] },
    },
    test_report: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent', enum: ['Sent', 'Valid', 'Invalid'] },
    },
    analysis_certificate: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent', enum: ['Sent', 'Valid', 'Invalid'] },
    },
    plan: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent', enum: ['Sent', 'Valid', 'Invalid'] },
    },
    other_docs: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent', enum: ['Sent', 'Valid', 'Invalid'] },
    },
    missing_docs: [],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('products', productSchema);
