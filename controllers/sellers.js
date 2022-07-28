/**
 * seller CRUD controllers
 * @author Shuja Naqvi
 */
const Seller = require('../models/sellers');

/**
 * Create seller
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await Seller.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'email already taken' });
    }
    const seller = await Seller.create(req.body); // Adding seller in db
    // Done
    res.json({ success: true, seller }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all seller
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const sellers = await Seller.find().populate('country').populate('user'); // Finding all the seller from db
    res.json({ success: true, sellers }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get seller by country
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const sellerId = req.params.sellerId; // Getting seller id from URL parameter
    const seller = await Seller.findById(sellerId).populate('country').populate('user'); // Finding seller by id
    res.json({ success: true, seller }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update seller
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const sellerId = req.params.sellerId; // Getting seller id from URL parameter
    const seller = await Seller.findByIdAndUpdate(sellerId, req.body, { new: true }); // Updating the country
    res.json({ success: true, seller }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete seller
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const sellerId = req.params.sellerId; // Getting seller id from URL parameter
    const seller = await Seller.findByIdAndDelete(sellerId); // Deleting the seller
    res.json({ success: true, seller }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
