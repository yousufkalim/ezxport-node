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
const Products = require('../models/Products');

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
    // req.body.certification_cost = 0;
    // for (let i = 0; i < codes.length; i++) {
    //   console.log(typeof codes[i].certification_required);
    //   if (codes[i].certification_required) {
    //     req.body.certification_cost += codes[i].monetary_value - 0; //To deal with coercion subtracted 0 from string :)
    //   }
    // }
    // return console.log(req.body.certification_cost, 'req.body.certification_cost');
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

/**       Update
 * Request  First-Step
 *        BOM
 * @param {object} req
 * @param {object} res
 */
exports.updateBoms = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { codes } = req.body;
    // req.body.certification_cost = 0;
    // for (let i = 0; i < codes.length; i++) {
    //   if (codes[i].certification_required ) {
    //     req.body.certification_cost += codes[i].monetary_value - 0; //To deal with coercion subtracted 0 from string :)
    //   }
    // }
    const request = await Request.findByIdAndUpdate(requestId, req.body, { new: true }); // Adding seller in db
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
    const { vendor, user, request, contact_info } = req.body;
    let existingVendor = await Vendors.findById(vendor);
    let existingUser = await Users.findById(user);
    let existingRequest = await Request.findById(request);
    if (!existingVendor) {
      return res.status(409).json({ success: false, message: 'Invalid VendorID' });
    }
    let existingUserVendor = await userVendor.findOne({ vendor: vendor, user: user });
    if (!existingUser) {
      return res.status(409).json({ success: false, message: 'Invalid userID' });
    }
    if (contact_info === 'true') {
      if (!req.body.contact_fname || !req.body.contact_fname || !req.body.contact_email) {
        return res.status(409).json({ success: false, message: 'all fields required in contact information section' });
      }
      existingUserVendor.contact_fname = req.body.contact_fname;
      existingUserVendor.contact_lname = req.body.contact_lname;
      existingUserVendor.contact_email = req.body.contact_email;
      await existingUserVendor.save();
    }
    if (!existingRequest) {
      return res.status(409).json({ success: false, message: 'Invalid requestID' });
    }

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
 * Request  4th-Step
 *        Documents
 * @param {object} req
 * @param {object} res
 */
exports.Documents = async (req, res) => {
  try {
    const { request, codes } = req.body;
    let updateRequest;
    for (let i = 0; i < codes.length; i++) {
      const product = await Products.create(codes[i]);
      updateRequest = await Request.findOneAndUpdate(
        { _id: request, 'codes.code': codes[i].code },
        { $push: { 'codes.$.products': product._id } },
        { new: true }
      );
    }
    return res.status(200).json({ success: true, request: updateRequest });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Request  4th-Step
 *        documentsUpload
 * @param {object} req
 * @param {object} res
 */
exports.documentsUpload = async (req, res) => {
  try {
    const { requestId } = req.params;
    let file;
    const { doc_id } = req.body;
    if (req.file) {
      file = req.file.path;
    }
    let exisitingDoc = await Request.findOne({ _id: requestId, 'documents.doc_id': doc_id });
    if (!exisitingDoc) {
      const documentObj = {
        doc_id: doc_id,
        url: [file],
      };
      const newDoc = await Request.findOneAndUpdate({ _id: requestId }, { $push: { documents: documentObj } }, { new: true });
      return res.json({ success: true, message: 'new document has been created', doc: newDoc });
    }
    exisitingDoc = await Request.findOneAndUpdate(
      { _id: requestId, 'documents.doc_id': doc_id },
      { $push: { 'documents.$.url': file } },
      { new: true }
    );
    return res.json({ success: true, message: ' document has been updated', doc: exisitingDoc });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get All Requests
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const requests = await Request.find({})
      .populate('user')
      .populate('country')
      .populate('vendor')
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate({
        path: 'codes',
        populate: {
          path: 'code',
        },
        populate: {
          path: 'products',
        },
      })
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
    res.status(200).json({ success: true, requets: requests });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get By userId
 * @param {object} req
 * @param {object} res
 */
exports.getByuserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const request = await Request.find({ user: userId })
      .populate('user')
      .populate('country')
      .populate('vendor')
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate({
        path: 'codes',
        populate: {
          path: 'code',
        },
        populate: {
          path: 'products',
        },
      })
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
    res.status(200).json({ success: true, requet: request });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get By countryId
 * @param {object} req
 * @param {object} res
 */
exports.getBycountryId = async (req, res) => {
  try {
    const { countryId } = req.params;
    const request = await Request.find({ country: countryId })
      .populate('user')
      .populate('country')
      .populate('vendor')
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate({
        path: 'codes',
        populate: {
          path: 'code',
        },
        populate: {
          path: 'products',
        },
      })
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
    res.status(200).json({ success: true, requet: request });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get All Requests
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId)
      .populate('user')
      .populate('country')
      .populate('vendor')
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate({
        path: 'codes',
        populate: {
          path: 'code',
        },
        populate: {
          path: 'products',
        },
      })
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
    res.status(200).json({ success: true, requet: request });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
