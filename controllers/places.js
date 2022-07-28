/**
 * place CRUD controllers
 * @author Shuja Naqvi
 */
const Place = require('../models/places');

/**
 * Create place
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { email } = req.body;
    const existingPlace = await Place.findOne({
      email: email,
    });
    if (existingPlace) {
      return res.status(409).json({ success: false, message: 'email already taken' });
    }
    const place = await Place.create(req.body); // Adding place in db
    // Done
    res.json({ success: true, place }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all place
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const places = await Place.find().populate('country').populate('user'); // Finding all the place from db
    res.json({ success: true, places }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get place by country
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const placeId = req.params.placeId; // Getting place id from URL parameter
    const place = await Place.findById(placeId).populate('country').populate('user'); // Finding place by id
    res.json({ success: true, place }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update place
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const placeId = req.params.placeId; // Getting place id from URL parameter
    const place = await Place.findByIdAndUpdate(placeId, req.body, { new: true }); // Updating the country
    res.json({ success: true, place }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete place
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const placeId = req.params.placeId; // Getting place id from URL parameter
    const place = await Place.findByIdAndDelete(placeId); // Deleting the place
    res.json({ success: true, place }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
