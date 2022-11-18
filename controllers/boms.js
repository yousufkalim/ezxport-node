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
    req.body.admin_code = true;
    const existingCode = await Boms.findOne({
      code: code,
      countries: { $in: countries },
      admin_code: true
    }); // Finding all the bom from db
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
    const boms = await Boms.find({ admin_code: true }).populate('countries'); // Finding all the bom from db
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
 * Get bom by id
 * @param {object} req
 * @param {object} res
 */
exports.getByCountryId = async (req, res) => {
  try {
    const countryId = req.params.countryId; // Getting bom id from URL parameter
    const bom = await Boms.find({ countries: countryId, admin_code: true }); // Finding bom by id
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

    // Initilization
    let country = await Country.findById(req.body.country);
    let boms = await Boms.find({ countries: country._id });
    let adminBoms = boms.filter(bom => bom.admin_code === true); // All the codes created by admin
    let privateBoms = boms.filter(bom => bom.admin_code === false); // All the codes created by user
    let rows = await xlsxFile(req.file.path);
    rows.shift(); // Removing first row that is containing headers

    // Checking if file is too large
    if (rows.length > 300) {
      return res.status(400).json({ success: false, message: 'File is too large' });
    }

    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; //Format to test if Code containing special character

    let matchedData = []; // Data that is matched with db and created by admin
    let unMatched = []; // Data that is not matched with db and not created by admin
    let unMatchedBomsToCreate = []; // Data that is not matched with db and not created by admin and need to be created

    // Iterating through each row to find matched and unmatched data
    rows.map(item => {
      // Validation, Skipping invalid rows
      if (!item[0] || !item[1] || format.test(item[0]) || isNaN(item[1])) {
        return;
      }
      let code = item[0].toString(); // Converting code to string as we have string in db
      let monetary_value = item[1];
      let bom = adminBoms.find(bom => code.includes(bom.code)); // This will check if code is included in any of the admin code
      if (bom) {
        // Found matched data
        matchedData.push({ bom, monetary_value });
      } else {
        // Not found matched data
        let bom = privateBoms.find(bom => bom.code === code); // Checking if the code is already in db
        if (bom) {
          unMatched.push({ bom, monetary_value });
        } else {
          // Creating an array of unmatched data that need to be created
          unMatchedBomsToCreate.push({
            bom: {
              code,
              countries: country._id,
              certification_required: false,
              admin_code: false
            },
            monetary_value
          });
        }
      }
    });

    let newBoms = await Boms.insertMany(unMatchedBomsToCreate.map(item => item.bom)); // Creating new boms without monetary value
    // Now we have to add newBom in unMatchedBomsToCreate array
    newBoms.map((bom, i) => {
      unMatchedBomsToCreate[i].bom = bom;
    });
    unMatched = unMatched.concat(unMatchedBomsToCreate); // Merging unMatched and unMatchedBomsToCreate
    // Finally
    res.status(200).json({ success: true, matchedData, unMatched });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Upload bom
 * @param {object} req
 * @param {object} res
 */
exports.uploadCodes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ success: false, message: 'File is required' });
    }
    const { country } = req.body;
    let newBom;
    var codes = [];
    const existingCountry = await Country.findById(country);
    if (!existingCountry) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }
    const boms = await Boms.find();
    const Bcodes = boms.map(e => {
      return e.code;
    });
    await xlsxFile(req.file.path).then(async rows => {
      var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      for (let k = 1; k < rows.length; k++) {
        let item = rows[k];
        if (item[0] !== null) {
          codes = item[0];
          if (!format.test(codes)) {
            if (Bcodes.indexOf(codes.toString()) === -1) {
              newBom = await Boms.create({
                code: codes,
                countries: country,
                certification_required: true,
                admin_code: true
              });
              existingCountry.boms.push(newBom._id);
              await existingCountry.save();
            } else {
              let bom = await Boms.findOne({ code: codes }); // Finding bom by id
              if (bom) {
                if (bom.admin_code) {
                  if (!bom.countries.includes(country)) {
                    bom.countries.push(country);
                    existingCountry.boms.push(bom._id);
                    await bom.save();
                    await existingCountry.save();
                  }
                } else {
                  newBom = await Boms.create({
                    code: codes,
                    countries: country,
                    certification_required: true,
                    admin_code: true
                  });
                  existingCountry.boms.push(newBom._id);
                  await existingCountry.save();
                }
              }
            }
          }
        }
      }
    });
    res.status(200).json({ success: true, message: 'Codes Uploaded Successfully' });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
