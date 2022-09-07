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
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
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
      status: { type: String, default: 'Sent' },
    },
    test_report: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent' },
    },
    analysis_certificate: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent' },
    },
    plan: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent' },
    },
    other_docs: {
      url: [{ type: String }],
      status: { type: String, default: 'Sent' },
    },
    missing_docs: [],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('products', productSchema);
