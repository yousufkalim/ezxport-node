/**
 * FollowRequest schema
 * @author Shuja Naqvi
 */
const mongoose = require('mongoose');

// Schema
const followRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'countries' },
    title: { type: String, required: true, unique: true },
    codes: [
      {
        code: { type: mongoose.Schema.Types.ObjectId, ref: 'codes' },
        monetary_value: Number,
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }],
      },
    ],
    documents: [
      {
        doc_id: { type: mongoose.Schema.Types.ObjectId, ref: 'documents' },
        url: [{ type: String }],
        status: String,
      },
    ],
    missing_docs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'documents',
      },
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vendors',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sellers',
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'buyers',
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'places',
    },
    inspection_date: {
      type: Date,
    },
    status: {
      type: String,
    },
    certification_cost: { currency: { type: String }, value: { type: String } },
    request_method: {
      type: String,
      enum: ['direct', 'platform'],
    },
    admin_remarks: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('requests', followRequestSchema);
