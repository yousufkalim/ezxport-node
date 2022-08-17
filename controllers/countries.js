/**
 * country CRUD controllers
 * @author Shuja Naqvi
 */
const Country = require('../models/Countries');
const Vendors = require('../models/Vendors');
const Documents = require('../models/Documents');
const Boms = require('../models/Boms');

/**
 * Create country - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const exisingCountry = await Country.findOne({ name: req.body.name });
    if (exisingCountry) {
      return res.status(404).json({ success: false, message: 'Country exist' });
    }
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
    const countries = await Country.find().populate('boms').populate('documents').populate('vendors').populate('calculation'); // Success; // Finding all the Country from db
    res.json({ success: true, countries });
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
    const country = await Country.findById(countryId)
      .populate('boms')
      .populate('documents')
      .populate('vendors')
      .populate('calculation'); // Finding country by id
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
    await Vendors.deleteMany({ countries: { $in: countryId } }); //Delete all vendors of all this Country
    await Boms.deleteMany({ countries: { $in: countryId } }); //Delete all Boms of all this Country
    await Documents.deleteMany({ countries: { $in: countryId } }); //Delete all Documents of all this Country
    res.json({ success: true, country }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
