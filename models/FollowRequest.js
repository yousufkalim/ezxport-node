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
    code_details: [
      {
        code: String,
        monetary_value: Number,
      },
    ],
    service_provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'serviceproviders',
    },
    certification_company: {
      last_name: String,
      first_name: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model('followrequests', followRequestSchema);
