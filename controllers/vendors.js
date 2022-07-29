/**
 * serviceProvider CRUD controllers
 * @author Shuja Naqvi
 */
const Vendor = require('../models/Vendors');
const Country = require('../models/Countries');

/**
 * Create serviceProvider - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { countries } = req.body;
    const vendor = await Vendor.create(req.body); // Adding serviceProvider in db
    await Country.updateMany({ _id: { $in: countries } }, { $push: { vendors: vendor._id } });

    // Done
    res.json({ success: true, vendor }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all serviceProvider
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const vendor = await Vendor.find().populate('countries'); // Finding all the serviceProvider from db
    res.json({ success: true, vendor }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get serviceProvider by country
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const serviceProviderId = req.params.serviceProviderId; // Getting serviceProvider id from URL parameter
    const vendor = await Vendor.findById(serviceProviderId).populate('countries'); // Finding serviceProvider by id
    res.json({ success: true, vendor }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
/**
 * Get serviceProvider by country
 * @param {object} req
 * @param {object} res
 */
exports.getByCountryId = async (req, res) => {
  try {
    const associated_countryId = req.params.associated_countryId; // Getting serviceProvider id from URL parameter
    const vendor = await Vendor.find({ countries: associated_countryId }).populate('countries'); // Finding serviceProvider by id
    res.json({ success: true, vendor }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update serviceProvider
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const serviceProviderId = req.params.serviceProviderId; // Getting serviceProvider id from URL parameter
    const vendor = await Vendor.findByIdAndUpdate(serviceProviderId, req.body, { new: true }); // Updating the country
    res.json({ success: true, vendor }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete serviceProvider
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const serviceProviderId = req.params.serviceProviderId; // Getting serviceProvider id from URL parameter
    const vendor = await Vendor.findByIdAndDelete(serviceProviderId); // Deleting the serviceProvider
    if (vendor) {
      await Country.updateMany({ vendors: vendor._id }, { $pull: { vendors: vendor._id } });
      return res.status(200).json({ success: true, message: 'Successfully Deleted', vendor }); // Success
    }
    res.json({ success: false, message: 'Already Deleted' }); // Already Deleted
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
