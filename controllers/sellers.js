/**
 * seller CRUD controllers
 * @author Shuja Naqvi
 */
const Seller = require('../models/Sellers');
const Users = require('../models/Users');
const Country = require('../models/Countries');
/**
 * Create seller
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { user } = req.body;
    let existingUser = await Users.findOne({
      _id: user,
    });
    if (!existingUser) {
      return res.status(409).json({ success: false, message: 'UserId is invalid' });
    }
    const existingCountry = await Country.findOne({ name: req.body.country });
    if (existingCountry) {
      req.body.country = existingCountry._id;
    } else {
      const newCountry = await Country.create({ name: req.body.country, currency: 'USD' });
      req.body.country = newCountry._id;
    }
    const existingSeller = await Seller.findOne(req.body);
    if (existingSeller) {
      return res.status(409).json({ success: false, message: 'Seller already exist' });
    }

    const seller = await Seller.create(req.body); // Adding seller in db
    existingUser.sellers.push(seller._id);
    await existingUser.save();
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
 * Get seller by country
 * @param {object} req
 * @param {object} res
 */
exports.getByUserandCountry = async (req, res) => {
  try {
    const { country, user } = req.body;
    const seller = await Seller.find({ country: country, user: user }).populate('country').populate('user'); // Finding seller by id
    res.json({ success: true, seller }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get seller by userId
 * @param {object} req
 * @param {object} res
 */
exports.getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const seller = await Seller.find({ user: userId }).populate('country').populate('user'); // Finding seller by userId
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
    const existingCountry = await Country.findOne({ name: req.body.country });
    if (existingCountry) {
      req.body.country = existingCountry._id;
    } else {
      const newCountry = await Country.create({ name: req.body.country, currency: 'USD' });
      req.body.country = newCountry._id;
    }
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
    if (seller) {
      await Users.update({ _id: seller.user }, { $pull: { sellers: sellerId } });
      return res.json({ success: true, seller }); // Success
    }
    res.json({ success: false, message: 'Already Deleted' }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
