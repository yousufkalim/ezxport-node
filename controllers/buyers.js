/**
 * buyer CRUD controllers
 * @author Shuja Naqvi
 */
const Buyer = require('../models/Buyers');
const Users = require('../models/Users');
const Country = require('../models/Countries');
/**
 * Create buyer
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { user, country } = req.body;
    let existingUser = await Users.findOne({
      _id: user,
    });
    if (!existingUser) {
      return res.status(409).json({ success: false, message: 'UserId is invalid' });
    }
    const existingCountry = await Country.findOne({ name: country });
    if (existingCountry) {
      req.body.country = existingCountry._id;
    } else {
      const newCountry = await Country.create({ name: country, currency: 'USD' });
      req.body.country = newCountry._id;
    }
    const existingBuyer = await Buyer.findOne(req.body);
    if (existingBuyer) {
      return res.status(409).json({ success: false, message: 'Buyer already exist' });
    }
    const buyer = await Buyer.create(req.body); // Adding seller in db
    existingUser.buyers.push(buyer._id);
    await existingUser.save();
    res.status(200).json({ success: true, buyer });
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
    const buyers = await Buyer.find().populate('user'); // Finding all the buyer from db
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
    const buyer = await Buyer.findById(buyerId).populate('user'); // Finding buyer by id
    res.json({ success: true, buyer }); // Success
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
exports.getByUserandCountry = async (req, res) => {
  try {
    const { country, user } = req.body;
    const buyer = await Buyer.find({ country: country, user: user }).populate('user'); // Finding seller by id
    res.json({ success: true, buyer }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/* Get buyer by userId
 * @param {object} req
 * @param {object} res
 */
exports.getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const buyer = await Buyer.find({ user: userId }).populate('user'); // Finding buyer by userId
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
    const existingCountry = await Country.findOne({ name: req.body.country });
    if (existingCountry) {
      req.body.country = existingCountry._id;
    } else {
      const newCountry = await Country.create({ name: req.body.country, currency: 'USD' });
      req.body.country = newCountry._id;
    }
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
    if (buyer) {
      await Users.update({ _id: buyer.user }, { $pull: { buyers: buyerId } });
      return res.json({ success: true, buyer }); // Success
    }
    res.json({ success: false, message: 'Already Deleted' }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
