/**
 * country CRUD controllers
 * @author Shuja Naqvi
 */
const Country = require('../models/Countries');
const Vendors = require('../models/Vendors');

/**
 * Create country - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const country = await Country.create(req.body); // Adding country in db
    // Done
    res.json({ success: true, country }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all Country
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const countries = await Country.find(); // Finding all the Country from db
    res.json({ success: true, countries }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get country by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const countryId = req.params.countryId; // Getting country id from URL parameter
    const country = await Country.findById(countryId); // Finding country by id
    res.json({ success: true, country }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update country
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const countryId = req.params.countryId; // Getting country id from URL parameter
    const country = await Country.findByIdAndUpdate(countryId, req.body, { new: true }); // Updating the country
    res.json({ success: true, country }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete country
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const countryId = req.params.countryId; // Getting country id from URL parameter
    const country = await Country.findByIdAndDelete(countryId); // Deleting the country
    await Vendors.update({}, { $pull: { countries: countryId } }, { multi: true }); //pull deletedcountry from ServiceProviders
    res.json({ success: true, country }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
