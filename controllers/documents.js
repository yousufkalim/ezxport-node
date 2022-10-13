/**
 * document CRUD controllers
 * @author Shuja Naqvi
 */
const Document = require('../models/Documents');
const Country = require('../models/Countries');
/**
 * Create document
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { countries } = req.body;
    const document = await Document.create(req.body); // Adding document in db
    await Country.updateMany({ _id: { $in: countries } }, { $push: { documents: document._id } });
    // Done
    res.json({ success: true, document }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all document
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const documents = await Document.find().populate('countries'); // Finding all the document from db
    res.json({ success: true, documents }); // Success
  } catch (err) {
    // Error handling
    'Error ----> ', err;
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get document by countryId
 * @param {object} req
 * @param {object} res
 */
exports.getByCountry = async (req, res) => {
  try {
    const countryId = req.params.countryId; // Getting country id from URL parameter
    const country = await Country.findById(countryId).populate('documents'); // Finding country by id
    const { documents } = country;
    res.json({ success: true, documents }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get document by Id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const documentId = req.params.documentId; // Getting document id from URL parameter
    const document = await Document.findById(documentId).populate('countries'); // Finding document by id
    res.json({ success: true, document }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update document
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const documentId = req.params.documentId; // Getting document id from URL parameter
    const document = await Document.findByIdAndUpdate(documentId, req.body, { new: true }); // Updating the countries
    res.json({ success: true, document }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete document
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const documentId = req.params.documentId; // Getting document id from URL parameter
    const document = await Document.findByIdAndDelete(documentId); // Deleting the document
    if (document) {
      await Country.updateMany({ documents: documentId }, { $pull: { documents: documentId } });
      return res.status(200).json({ success: true, message: 'Successfully Deleted', document }); // Success
    }
    res.json({ success: false, message: 'Already Deleted' }); // Already Deleted
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
