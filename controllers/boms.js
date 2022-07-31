/**
 * bom CRUD controllers
 * @author Shuja Naqvi
 */
const xlsxFile = require('read-excel-file/node');
const Boms = require('../models/Boms');
const Country = require('../models/Countries');
/**
 * Create bom
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { code, countries } = req.body;
    const existingCode = await Boms.findOne({ code: code }); // Finding all the bom from db
    if (existingCode) {
      return res.status(409).json({ success: false, message: 'Code already exist' });
    }
    const boms = await Boms.create(req.body); // Adding boms in db
    await Country.updateMany({ _id: { $in: countries } }, { $push: { boms: boms._id } });
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
    const boms = await Boms.find().populate('countries'); // Finding all the bom from db
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
    const bom = await Boms.findById(bomId).populate('countries'); // Finding bom by id
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
    if (bom) {
      await Country.updateMany({ boms: bomId }, { $pull: { boms: bomId } });
      return res.status(200).json({ success: true, message: 'Successfully Deleted', bom }); // Success
    }
    res.json({ success: false, message: 'Already Deleted' }); // Already Deleted
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Filter bom
 * @param {object} req
 * @param {object} res
 */
exports.filterCode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ success: false, message: 'File is required' });
    }
    const { country } = req.body;
    let data = [];
    var array = [];
    const boms = await Boms.find({ countries: country });
    if (boms.length < 1) {
      return res.status(404).json({ success: false, message: 'Codes not found for this country' });
    }
    await xlsxFile(req.file.path).then((rows) => {
      rows.forEach(async (item) => {
        array = item[0].split('\n');
        for (let i = 0; i < boms.length; i++) {
          if (boms[i].code === array[0]) {
            data.push({
              bom: boms[i],
            });
          }
        }
      });
    });
    res.status(200).json({ success: true, matchedData: data });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
