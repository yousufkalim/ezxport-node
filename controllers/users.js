/**
 * User CRUD controllers
 * @author Yousuf Kalim
 */
const Users = require('../models/Users');
const Sellers = require('../models/Sellers');
const Admins = require('../models/Admins');
const Buyers = require('../models/Buyers');
const Places = require('../models/Places');
const Vendors = require('../models/UserVendors');
const bcrypt = require('bcryptjs');
const { sendQuestion } = require('../utils/sendEmail');
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password } = req.body; // Getting required fields from body
    const existingUser = await Users.findOne({ email }); // Finding already existing user
    const existingAdmin = await Admins.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser || existingAdmin) {
      // If we found existing user in db
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }

    // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    const user = await Users.create(req.body); // Adding user in db

    // Done
    res.json({ success: true, user }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all users
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Users.find(); // Finding all the users from db
    res.json({ success: true, users }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findById(userId); // Finding user by id
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    let { email } = req.body; // Getting required fields from body
    const existingUser = await Users.findOne({
      email: email,
    });
    if (existingUser) {
      if (existingUser._id != userId) {
        // If we found existing user in db
        return res.status(409).json({ success: false, message: 'Email already associated with another user' });
      }
    }

    // If user want to update it's password
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, parseInt(bcryptSalt));
    }

    const user = await Users.findByIdAndUpdate(userId, req.body, { new: true }); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findByIdAndDelete(userId); // Deleting the user
    if (user) {
      await Sellers.deleteMany({ _id: { $in: user.sellers } });
      await Buyers.deleteMany({ _id: { $in: user.buyers } });
      await Places.deleteMany({ _id: { $in: user.places } });
      await Vendors.deleteMany({ _id: { $in: user.vendors } });
      return res.json({ success: false, message: 'Successfully Deleted' }); // Success
    }
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.sendQuestion = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const { requestTitle, message, question } = req.body;
    const user = await Users.findById(userId); // Deleting the user
    if (!user) {
      return res.json({ success: false, message: 'User Not Found' }); // Success
    }
    const param = { email: user.email, title: requestTitle, question: question, message: message };
    sendQuestion(param).then((resp) => {
      res.json({ success: true, message: 'Question sent Successfully' }); // Success
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
