/**
 * serviceProvider CRUD controllers
 * @author Shuja Naqvi
 */
const Vendor = require('../models/Vendors');
const Requests = require('../models/Requests');
const User = require('../models/Users');
const userVendor = require('../models/UserVendors');
const Country = require('../models/Countries');

/**
 * Create serviceProvider - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { countries, contact_email } = req.body;
    const existingVendor = await Vendor.findOne({
      $or: [{ sending_email: req.body.contact_email }, { contact_email: req.body.contact_email }],
    });
    if (existingVendor) {
      /**
       * This filter will return new selected countries
       * let's say user has selected two countires.
       *  one of them is already associated with this email
       * then this filter will return the country which is not associated with this email :}
       */
      let newCountries = countries.filter((o1) => !existingVendor.countries.some((o2) => o1 == o2));
      if (newCountries.length > 0) {
        req.body.countries = newCountries;
        const vendor = await Vendor.create(req.body); // Adding serviceProvider in db
        await Country.updateMany({ _id: { $in: countries } }, { $push: { vendors: vendor._id } });
        // Done
        return res.json({ success: true, vendor }); //Success
      }
      return res.status(404).json({ success: false, message: 'vendor already exist' }); //Success
    }

    const vendor = await Vendor.create(req.body); // Adding serviceProvider in db
    await Country.updateMany({ _id: { $in: countries } }, { $push: { vendors: vendor._id } });

    // Done
    res.json({ success: true, vendor }); //Success
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
    const vendor = await Vendor.find().populate('countries'); // Finding all the serviceProvider from db
    res.json({ success: true, vendor }); // Success
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
    const userId = req.params.serviceProviderId; // Getting serviceProvider id from URL parameter
    const vendor = await Vendor.findById(userId).populate('countries'); // Finding serviceProvider by id
    res.json({ success: true, vendor }); // Success
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
    const vendor = await Vendor.find({ countries: associated_countryId }).populate('countries'); // Finding serviceProvider by id
    res.json({ success: true, vendor }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update userVendors
 * @param {object} req
 * @param {object} res
 */
exports.updateUserVendor = async (req, res) => {
  try {
    const { userVendorId } = req.params;

    const existingUserVendor = await userVendor.findById(userVendorId);

    if (existingUserVendor) {
      const vendor = await userVendor.findByIdAndUpdate(userVendorId, req.body, { new: true }); // Updating the country
      res.json({ success: true, vendor }); // Success
    } else {
      res.json({ success: false, message: 'userVendor not found' }); //Success
    }
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
    const existingVendor = await Vendor.findById(serviceProviderId); // Updating the country
    if (existingVendor) {
      if (existingVendor.sending_email !== req.body.sending_email) {
        const existingVendorS = await Vendor.findOne({
          $or: [{ sending_email: req.body.sending_email }, { contact_email: req.body.sending_email }],
        });
        if (existingVendorS) {
          return res.json({ success: false, message: 'sending_email is already associated with another vendor' }); //Success
        }
      }
    }
    //This filter will return new selected countries
    let newCountries = req.body.countries.filter((o1) => !existingVendor.countries.some((o2) => o1 == o2));
    //This filter will return unchecked countries,using DB data
    let uncheckedCountries = existingVendor.countries.filter((o1) => !req.body.countries.some((o2) => o1 == o2));
    //Push vendor in new country
    await Country.updateMany({ _id: { $in: newCountries } }, { $push: { vendors: serviceProviderId } });
    //Pull vendor from unselected Countries
    await Country.updateMany({ _id: { $in: uncheckedCountries } }, { $pull: { vendors: serviceProviderId } });
    const vendor = await Vendor.findByIdAndUpdate(serviceProviderId, req.body, { new: true }); // Updating the Vendor :)
    res.json({ success: true, vendor }); // Success
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
    const vendor = await Vendor.findByIdAndDelete(serviceProviderId); // Deleting the serviceProvider
    if (!vendor) {
      return res.status(404).send({
        success: false,
        message: 'vendor  not Found, could not delete',
      });
    }
    await Country.updateMany({ vendors: vendor._id }, { $pull: { vendors: vendor._id } });
    const uservendors = await userVendor.find({ vendor: vendor._id });
    const vendorIds = uservendors.map((e) => {
      return e._id;
    });
    await userVendor.deleteMany({
      _id: { $in: vendorIds },
    });
    await Requests.deleteMany({ vendor: { $in: vendorIds } });
    await User.update({}, { $pull: { vendors: { $in: vendorIds } } }, { multi: true });
    return res.status(200).json({ success: true, message: 'Successfully Deleted', vendor }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getuserVendor = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting serviceProvider id from URL parameter
    const Uservendors = await userVendor.find({ user: userId }).populate('vendor'); // Deleting the serviceProvider
    res.json({ success: false, Uservendors: Uservendors }); // Already Deleted
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
