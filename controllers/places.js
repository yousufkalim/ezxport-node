/**
 * place CRUD controllers
 * @author Shuja Naqvi
 */
const Place = require('../models/Places');
const Users = require('../models/Users');
const Country = require('../models/Countries');

/**
 * Create place
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
    const existingPlace = await Place.findOne(req.body);
    if (existingPlace) {
      return res.status(409).json({ success: false, message: 'Place already exist' });
    }
    const place = await Place.create(req.body); // Adding seller in db
    existingUser.places.push(place._id);
    await existingUser.save();
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
    const places = await Place.find().populate('user'); // Finding all the place from db
    res.json({ success: true, places }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get place by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const placeId = req.params.placeId; // Getting place id from URL parameter
    const place = await Place.findById(placeId).populate('user'); // Finding place by id
    res.json({ success: true, place }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
/**
 * Get placce by userId
 * @param {object} req
 * @param {object} res
 */
exports.getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const place = await Place.find({ user: userId }).populate('user'); // Finding seller by userId
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
    const existingCountry = await Country.findOne({ name: req.body.country });
    if (existingCountry) {
      req.body.country = existingCountry._id;
    } else {
      const newCountry = await Country.create({ name: req.body.country, currency: 'USD' });
      req.body.country = newCountry._id;
    }
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
    if (place) {
      await Users.update({ _id: place.user }, { $pull: { places: placeId } });
      return res.json({ success: true, place }); // Success
    }
    res.json({ success: false, message: 'Already Deleted' }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
