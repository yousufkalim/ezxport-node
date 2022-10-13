/**
 * serviceProvider CRUD controllers
 * @author Shuja Naqvi
 */
const Vendor = require('../models/Vendors');
const userVendor = require('../models/UserVendors');
const Country = require('../models/Countries');

/**
 * Create serviceProvider - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    const { countries } = req.body;
    const existingVendor = await Vendor.find({
      deleted: false,
      sending_email: req.body.sending_email
    });
    if (existingVendor.length > 0) {
      /**
       * This filter will return new selected countries
       * let's say user has selected two countires.
       *  one of them is already associated with this email
       * then this filter will return the country which is not associated with this email :}
       */
      const Allcountries = existingVendor.reduce(
        (acc, c) => [...new Set([...acc, c.countries].flat())],
        []
      );
      const newCountries = countries.filter(o1 => !Allcountries.some(o2 => o1 == o2));
      if (newCountries.length > 0) {
        req.body.countries = newCountries;
        const vendor = await Vendor.create(req.body); // Adding serviceProvider in db
        await Country.updateMany(
          { _id: { $in: req.body.countries } },
          { $push: { vendors: vendor._id } }
        );
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
    const vendor = await Vendor.find({ deleted: false }).populate('countries'); // Finding all the serviceProvider from db
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
    const vendor = await Vendor.find({ countries: associated_countryId, deleted: false }).populate(
      'countries'
    ); // Finding serviceProvider by id
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
          deleted: false,
          sending_email: req.body.sending_email,
          countries: req.body.countries
        });
        if (existingVendorS) {
          return res.json({
            success: false,
            message: 'sending_email is already associated with another vendor'
          }); //Success
        }
      }
    }
    //This filter will return new selected countries
    let newCountries = req.body.countries.filter(
      o1 => !existingVendor.countries.some(o2 => o1 == o2)
    );
    if (newCountries.length > 0) {
      const existingVendors = await Vendor.find({
        sending_email: req.body.sending_email
      });
      const existingCountryVendor = await Vendor.find({
        countries: { $in: newCountries },
        sending_email: req.body.sending_email
      });
      const Vendorscountries = existingCountryVendor.reduce(
        (acc, c) => [...new Set([...acc, c.countries.toString()].flat())],
        []
      );
      const tempArray = req.body.countries.filter(el => !Vendorscountries.includes(el));
      req.body.countries = tempArray;
      const Allcountries = existingVendors.reduce(
        (acc, c) => [...new Set([...acc, c.countries.toString()].flat())],
        []
      );
      newCountries = newCountries.filter(o1 => !Allcountries.some(o2 => o1 == o2));
    }

    //This filter will return unchecked countries,using DB data
    let uncheckedCountries = existingVendor.countries.filter(
      o1 => !req.body.countries.some(o2 => o1 == o2)
    );
    //Push vendor in new country
    await Country.updateMany(
      { _id: { $in: newCountries } },
      { $push: { vendors: serviceProviderId } }
    );
    //Pull vendor from unselected Countries
    await Country.updateMany(
      { _id: { $in: uncheckedCountries } },
      { $pull: { vendors: serviceProviderId } }
    );
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
    const vendor = await Vendor.findByIdAndUpdate(
      serviceProviderId,
      { deleted: true },
      { new: true }
    ); // Deleting the serviceProvider
    if (!vendor) {
      return res.status(404).send({
        success: false,
        message: 'vendor does not Found, could not delete'
      });
    }
    await Country.updateMany({ vendors: vendor._id }, { $pull: { vendors: vendor._id } });
    res.json({ success: false, message: 'Vendor Deleted' }); // Already Deleted
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
