/**
 * calculation CRUD controllers
 * @author Shuja Naqvi
 */
const Calculation = require('../models/Calculations');
const Country = require('../models/Countries');

/**
 * Create calculation
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { country } = req.body;
    const existingCalculation = await Calculation.findOne({ country: country });
    if (existingCalculation) {
      return res.status(409).json({ success: false, message: 'calculation already existed with this country' });
    }
    const calculation = await Calculation.create(req.body); // Adding calculation in db
    await Country.findByIdAndUpdate({ _id: country }, { calculation: calculation._id });
    // Done
    res.json({ success: true, calculation }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all calculation
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const calculation = await Calculation.find().populate('country'); // Finding all the Calculation from db
    res.json({ success: true, calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get Calculation by country
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const calculationId = req.params.calculationId; // Getting calculation id from URL parameter
    const calculation = await Calculation.findById(calculationId).populate('country'); // Finding calculation by id
    res.json({ success: true, calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
/**
 * Get calculation by country
 * @param {object} req
 * @param {object} res
 */
exports.getByCountryId = async (req, res) => {
  try {
    const countryId = req.params.countryId; // Getting calculation id from URL parameter
    const calculation = await Calculation.findOne({ country: countryId }).populate('country'); // Finding calculation by id
    res.json({ success: true, calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update calculation
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const calculationId = req.params.calculationId; // Getting calculation id from URL parameter
    const calculation = await Calculation.findByIdAndUpdate(calculationId, req.body, { new: true }); // Updating the country
    res.json({ success: true, calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete calculation
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const calculationId = req.params.calculationId; // Getting calculation id from URL parameter
    const calculation = await Calculation.findByIdAndDelete(calculationId); // Deleting the calculation
    return res.status(200).json({ success: true, message: 'Successfully Deleted', calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
