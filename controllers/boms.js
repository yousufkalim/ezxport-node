/**
 * bom CRUD controllers
 * @author Shuja Naqvi
 */

const Boms = require('../models/Boms');
/**
 * Create bom
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { code } = req.body;
    const existingCode = await Boms.findOne({ code: code }); // Finding all the bom from db
    if (existingCode) {
      return res.status(409).json({ success: false, message: 'Code already exist' });
    }
    const boms = await Boms.create(req.body); // Adding boms in db
    // Done
    res.json({ success: true, boms }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all bom
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const boms = await Boms.find(); // Finding all the bom from db
    res.json({ success: true, boms }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get bom by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const bomId = req.params.bomId; // Getting bom id from URL parameter
    const bom = await Boms.findById(bomId); // Finding bom by id
    res.json({ success: true, bom }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update bom
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const bomId = req.params.bomId; // Getting bom id from URL parameter
    const bom = await Boms.findByIdAndUpdate(bomId, req.body, { new: true }); // Updating the bom
    res.json({ success: true, bom }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete bom
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const bomId = req.params.bomId; // Getting bom id from URL parameter
    const bom = await Boms.findByIdAndDelete(bomId); // Deleting the bom
    res.json({ success: true, bom }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
