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
    title: { type: String, required: true },
    codes: [
      {
        code: { type: mongoose.Schema.Types.ObjectId, ref: 'codes' },
        monetary_value: Number,
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
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
