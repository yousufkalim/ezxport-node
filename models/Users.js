/**
 * User schema
 * @author Yousuf Kalim
 */
const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    password: String,
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    fullAddress: {
      type: String,
      trim: true,
    },
    town: {
      type: String,
      trim: true,
    },
    postelCode: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    companyInformation_lastName: {
      type: String,
      trim: true,
    },
    typeOfSociety: {
      type: String,
      trim: true,
    },
    VatNumber: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // image: {
    //   type: String,
    //   trim: true,
    // },
    // Blogs: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Blog",
    //     required: false,
    //   },
    // ],
    // Projects: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Project",
    //     required: false,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("users", userSchema);


