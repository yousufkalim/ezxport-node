/**
 * Requets controllers
 * @author Shuja Naqvi
 */
const Codes = require('../models/Boms');
const Users = require('../models/Users');
const Vendors = require('../models/Vendors');
const Request = require('../models/Requests');
const userVendor = require('../models/UserVendors');
const Seller = require('../models/Sellers');
const Buyer = require('../models/Buyers');
const Place = require('../models/Places');

/**
 * Request  First-Step
 *        BOM
 * @param {object} req
 * @param {object} res
 */
exports.boms = async (req, res) => {
  try {
    const { user, codes } = req.body;
    let existingUser = await Users.findOne({
      _id: user,
    });
    if (!existingUser) {
      return res.status(409).json({ success: false, message: 'UserId is invalid' });
    }
    const filteredCodes = codes.filter((e) => e.certification_required);
    return console.log(filteredCodes, 'filteredCodes');
    req.body.certification_cost = filteredCodes.map((code) => code.monetary_value).reduce((prev, curr) => +prev + +curr, 0);

    const request = await Request.create(req.body); // Adding seller in db
    existingUser.requests.push(request._id);
    await existingUser.save();
    res.json({ success: true, request }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Request  Second-Step
 *        Service Provider
 * @param {object} req
 * @param {object} res
 */
exports.userVendor = async (req, res) => {
  try {
    const { vendor, user, request } = req.body;
    let existingVendor = await Vendors.findById(vendor);
    let existingUser = await Users.findById(user);
    let existingRequest = await Request.findById(request);
    if (!existingVendor) {
      return res.status(409).json({ success: false, message: 'Invalid VendorID' });
    }
    if (!existingUser) {
      return res.status(409).json({ success: false, message: 'Invalid userID' });
    }
    if (!existingRequest) {
      return res.status(409).json({ success: false, message: 'Invalid requestID' });
    }
    let existingUserVendor = await userVendor.findOne({ vendor: vendor, user: user });
    if (!existingUserVendor) {
      const UserVendor = await userVendor.create(req.body);
      existingUser.vendors.push(UserVendor._id);
      await existingUser.save();
      existingRequest.vendor = UserVendor._id;
      await existingRequest.save();
      return res.status(200).json({ success: true, message: 'userVendor created', request: existingRequest });
    }
    existingRequest.vendor = existingUserVendor._id;
    await existingRequest.save();
    return res.status(200).json({ success: true, message: 'userVendor updated', request: existingRequest });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Request  Third-Step
 *        Dispatch
 * @param {object} req
 * @param {object} res
 */
exports.Dispatch = async (req, res) => {
  try {
    const { place, seller, buyer, request } = req.body;
    let existingRequest = await Request.findById(request);
    let existingUser = await Users.findById(existingRequest.user);
    if (!existingRequest) {
      return res.status(409).json({ success: false, message: 'Invalid RequestId' });
    }

    const existingSeller = await Seller.findOne(seller);
    if (existingSeller) {
      existingRequest.seller = existingSeller._id;
    } else {
      const new_seller = await Seller.create(seller); // Adding seller in db
      existingUser.sellers.push(new_seller._id);
      existingRequest.seller = new_seller._id;
      await existingUser.save();
    }

    const existingBuyer = await Buyer.findOne(buyer);
    if (existingBuyer) {
      existingRequest.buyer = existingBuyer._id;
    } else {
      const new_buyer = await Buyer.create(buyer); // Adding seller in db
      existingUser.buyers.push(new_buyer._id);
      existingRequest.buyer = new_buyer._id;
      await existingUser.save();
    }

    const existingPlace = await Place.findOne(place);
    if (existingPlace) {
      existingRequest.place = existingPlace._id;
    } else {
      const new_place = await Place.create(place); // Adding seller in db
      existingUser.places.push(new_place._id);
      existingRequest.place = new_place._id;
      await existingUser.save();
    }
    await existingRequest.save();
    return res.status(200).json({ success: true, message: 'Dispatched', request: existingRequest });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Request  Third-Step
 *        Dispatch
 * @param {object} req
 * @param {object} res
 */
exports.Documents = async (req, res) => {
  try {
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
