/**
 * buyer CRUD controllers
 * @author Shuja Naqvi
 */
const Buyer = require('../models/Buyers');

/**
 * Create buyer
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await Buyer.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'email already taken' });
    }
    const buyer = await Buyer.create(req.body); // Adding buyer in db
    // Done
    res.json({ success: true, buyer }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all buyer
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const buyers = await Buyer.find().populate('country').populate('user'); // Finding all the buyer from db
    res.json({ success: true, buyers }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get buyer by country
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const buyerId = req.params.buyerId; // Getting buyer id from URL parameter
    const buyer = await Buyer.findById(buyerId).populate('country').populate('user'); // Finding buyer by id
    res.json({ success: true, buyer }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update buyer
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const buyerId = req.params.buyerId; // Getting buyer id from URL parameter
    const buyer = await Buyer.findByIdAndUpdate(buyerId, req.body, { new: true }); // Updating the country
    res.json({ success: true, buyer }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete buyer
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const buyerId = req.params.buyerId; // Getting buyer id from URL parameter
    const buyer = await Buyer.findByIdAndDelete(buyerId); // Deleting the buyer
    res.json({ success: true, buyer }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
