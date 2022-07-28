/**
 * addressbook CRUD controllers
 * @author Shuja Naqvi
 */
const addressBook = require('../models/AddressBooks');

/**
 * Create addressBook
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await addressBook.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'email already taken' });
    }
    const addressbook = await addressBook.create(req.body); // Adding addressbook in db
    // Done
    res.json({ success: true, addressbook }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Filter AddressBook
 * @param {object} req
 * @param {object} res
 */
exports.getByRole = async (req, res) => {
  try {
    const { role } = req.body;
    const existingUsers = await addressBook
      .find({
        role: role,
      })
      .populate('country');
    // Done
    res.json({ success: true, existingUsers }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all addressbook
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const addressbooks = await addressBook.find().populate('country'); // Finding all the addressbook from db
    res.json({ success: true, addressbooks }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get addressbook by country
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const addressbookId = req.params.addressbookId; // Getting addressbook id from URL parameter
    const addressbook = await addressBook.findById(addressbookId).populate('country'); // Finding addressbook by id
    res.json({ success: true, addressbook }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update addressbook
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const addressbookId = req.params.addressbookId; // Getting addressbook id from URL parameter
    const addressbook = await addressBook.findByIdAndUpdate(addressbookId, req.body, { new: true }); // Updating the country
    res.json({ success: true, addressbook }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete addressbook
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const addressbookId = req.params.addressbookId; // Getting addressbook id from URL parameter
    const addressbook = await addressBook.findByIdAndDelete(addressbookId); // Deleting the addressbook
    res.json({ success: true, addressbook }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
