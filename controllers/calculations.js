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
    if (req.body.type == 'range') {
      if (!req.body.range) {
        return res.json({ success: false, message: 'Range is required' }); // Success
      }
      if (req.body.range.length < 1) {
        return res.json({ success: false, message: 'Range is required' }); // Success
      }
    }
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

/**
 * add Range
 * @param {object} req
 * @param {object} res
 */
exports.addRange = async (req, res) => {
  try {
    const calculationId = req.params.calculationId; // Getting calculation id from URL parameter
    const calculation = await Calculation.findByIdAndUpdate(
      calculationId,
      { $push: { range: req.body.range }, type: 'range' },
      { new: true }
    ); // Updating the country
    res.json({ success: true, calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * deleteRange calculation
 * @param {object} req
 * @param {object} res
 */
exports.deleteRange = async (req, res) => {
  try {
    const calculationId = req.params.calculationId; // Getting calculation id from URL parameter
    const calculation = await Calculation.findByIdAndUpdate(
      calculationId,
      { $pull: { range: { _id: req.body.rangeId } } },
      { new: true }
    ); // Updating the country
    res.json({ success: true, calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * updateRange calculation
 * @param {object} req
 * @param {object} res
 */
exports.updateRange = async (req, res) => {
  try {
    const calculationId = req.params.calculationId; // Getting calculation id from URL parameter
    const calculation = await Calculation.findOneAndUpdate(
      { _id: calculationId, 'range._id': req.body.rangeId },
      {
        $set: {
          'range.$.max': req.body.range.max,
          'range.$.min': req.body.range.min,
          'range.$.certificate_cost': req.body.range.certificate_cost,
        },
      },
      { new: true }
    ); // Updating the country
    res.json({ success: true, calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * updateType calculation
 * @param {object} req
 * @param {object} res
 */
exports.updateType = async (req, res) => {
  try {
    const calculationId = req.params.calculationId; // Getting calculation id from URL parameter
    const calculation = await Calculation.findByIdAndUpdate(calculationId, { type: req.body.type }, { new: true }); // Updating the country
    res.json({ success: true, calculation }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
