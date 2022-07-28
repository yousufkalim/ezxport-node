/**
 * serviceProvider CRUD controllers
 * @author Shuja Naqvi
 */
const serviceProvider = require('../models/Vendors');

/**
 * Create serviceProvider - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { sending_email, contact_email } = req.body;
    const existingProvider = await serviceProvider.findOne({
      $or: [{ sending_email: sending_email }, { contact_email: contact_email }],
    });
    if (existingProvider) {
      return res.status(409).json({ success: false, message: 'contact email or sending email already taken' });
    }
    const serviceprovider = await serviceProvider.create(req.body); // Adding serviceProvider in db
    // Done
    res.json({ success: true, serviceprovider }); //Success
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
    const serviceProviders = await serviceProvider.find().populate('countries'); // Finding all the serviceProvider from db
    res.json({ success: true, serviceProviders }); // Success
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
    const serviceprovider = await serviceProvider.findById(serviceProviderId).populate('countries'); // Finding serviceProvider by id
    res.json({ success: true, serviceprovider }); // Success
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
    const serviceProviders = await serviceProvider.find({ countries: associated_countryId }).populate('countries'); // Finding serviceProvider by id
    res.json({ success: true, serviceProviders }); // Success
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
    const serviceProvider = await serviceProvider.findByIdAndUpdate(serviceProviderId, req.body, { new: true }); // Updating the country
    res.json({ success: true, country }); // Success
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
    const serviceprovider = await serviceProvider.findByIdAndDelete(serviceProviderId); // Deleting the serviceProvider
    res.json({ success: true, serviceprovider }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
