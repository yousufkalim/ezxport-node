/**
 * Requets controllers
 * @author Shuja Naqvi
 */
const fs = require('fs');
const Codes = require('../models/Boms');
const Documents = require('../models/Documents');
const Country = require('../models/Countries');
const Users = require('../models/Users');
const Vendors = require('../models/Vendors');
const Request = require('../models/Requests');
const userVendor = require('../models/UserVendors');
const Seller = require('../models/Sellers');
const Buyer = require('../models/Buyers');
const Place = require('../models/Places');
const Products = require('../models/Products');
const { CountryNameCode } = require('../utils/Countries');
/**
 * Request  Create-Title
 *        Request
 * @param {object} req
 * @param {object} res
 */

exports.createName = async (req, res) => {
  try {
    const { userId, countryId } = req.body;
    var number;
    let existingUser = await Users.findOne({
      _id: userId,
    });
    if (!existingUser) {
      return res.status(409).json({ success: false, message: 'UserId is invalid' });
    }
    const country = await Country.findById(countryId);
    const Requests = await Request.find().sort({ createdAt: -1 });
    //Find Country Code from file
    const code = CountryNameCode.filter((e) => e.name.toLowerCase() === country.name.toLowerCase());
    if (Requests.length === 0) {
      number = '000';
    }
    if (Requests.length > 0 && Requests.length < 9) {
      number = '00' + (+Requests.length + +1);
    }
    if (Requests.length === 9) {
      number = '010';
    }
    if (Requests.length > 9 && Requests.length < 99) {
      number = '0' + (+Requests.length + +1);
    }
    if (Requests.length === 99) {
      number = '100';
    }
    if (Requests.length > 99) {
      number = Requests.length + 1;
    }

    let name = existingUser.company.name + code[0].code + number;
    name = name.replace(/\s*$/, '');
    const exisitingRequest = await Request.findOne({ title: name });
    if (exisitingRequest) {
      let number = Requests[0].title.substr(Requests[0].title.length - 3);
      number = +number + +1;
      let name = existingUser.company.name + code[0].code + number;
      name = name.replace(/\s*$/, '');
      return res.json({ success: true, message: 'Request Title', title: name });
    }
    return res.json({ success: true, message: 'Request Title', tile: name });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Request  Search-Title
 *        Request
 * @param {object} req
 * @param {object} res
 */

exports.searchName = async (req, res) => {
  try {
    let { title } = req.body;
    title = title.replace(/\s*$/, '');
    const exisitingRequest = await Request.findOne({ title: title });
    if (exisitingRequest) {
      return res.status(404).json({ success: false, message: 'title  already in use' });
    }
    res.json({ success: true, message: 'title is unique' });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

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
    //If certification not required by all of documents
    const certificationNotReq = codes.every(function (v) {
      const boolVal = JSON.parse(v.certification_required);
      return !boolVal;
    });
    //If certification not required by all of documents
    //then set its request status will be not required
    //and cost value will be 0
    if (certificationNotReq) {
      req.body.status = 'not required';
      req.body.certification_cost = { value: 0 };
      const request = await Request.create(req.body); // Adding seller in db
      existingUser.requests.push(request._id);
      await existingUser.save();
      return res.json({ success: true, request, message: 'certification not required' }); //Success
    }
    //If certification  required by some of documents
    //then calculate monetory values for required codes
    let value = 0;
    for (let i = 0; i < codes.length; i++) {
      const boolVal = JSON.parse(codes[i].certification_required);
      if (boolVal) {
        value = +value + +codes[i].monetary_value; //To deal with coercion subtracted 0 from string :)
      }
    }

    req.body.certification_cost = { value: value };

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
    //If certification not required by all of documents
    const certificationNotReq = codes.every(function (v) {
      const boolVal = JSON.parse(v.certification_required);
      return !boolVal;
    });
    //If certification not required by all of documents
    //then set its request status will be not required
    //and cost value will be 0
    if (certificationNotReq) {
      req.body.status = 'not required';
      req.body.certification_cost = { value: 0 };
      const request = await Request.findByIdAndUpdate(requestId, req.body, { new: true }); // Adding seller in db
      return res.json({ success: true, request }); //Success
    }
    //If certification  required by some of documents
    //then calculate monetory values for required codes
    let value = 0;
    for (let i = 0; i < codes.length; i++) {
      const boolVal = JSON.parse(codes[i].certification_required);
      if (boolVal) {
        value = +value + +codes[i].monetary_value; //To deal with coercion subtracted 0 from string :)
      }
    }
    req.body.certification_cost = { value: value };
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
    if (contact_info) {
      if (!req.body.contact_fname || !req.body.contact_fname || !req.body.contact_email) {
        return res.status(409).json({ success: false, message: 'all fields required in contact information section' });
      }
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
    existingUserVendor.contact_fname = req.body.contact_fname;
    existingUserVendor.contact_lname = req.body.contact_lname;
    existingUserVendor.contact_email = req.body.contact_email;
    await existingUserVendor.save();
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
    existingRequest = await Request.findById(request)
      .populate('user')
      .populate('country')
      .populate('missing_docs')
      .populate('vendor')
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate('codes.code')
      .populate('codes.products')
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
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
    //If missing_docs has doc_id then pull it
    await Request.findByIdAndUpdate({ _id: requestId }, { $pull: { missing_docs: doc_id } });
    //Check if request has create document with one file atleast...?
    let exisitingDoc = await Request.findOne({ _id: requestId, 'documents.doc_id': doc_id });
    // if document with provided id is not created
    if (!exisitingDoc) {
      const documentObj = {
        doc_id: doc_id,
        url: [file],
      };
      const newDoc = await Request.findOneAndUpdate({ _id: requestId }, { $push: { documents: documentObj } }, { new: true });
      return res.json({ success: true, message: 'new document has been created', doc: newDoc });
    }
    // else if  request has already document with provided id then this will updated request!
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
      .populate('missing_docs')
      .populate('codes.code')
      .populate('codes.products')
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
      .populate('missing_docs')
      .populate('seller')
      .populate('codes.code')
      .populate('codes.products')
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
      .populate('missing_docs')
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
 * Get Request By Id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId)
      .populate('user')
      .populate('country')
      .populate('missing_docs')
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
 * validate Documents
 * @param {object} req
 * @param {object} res
 */

exports.validateDoc = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { doc_id, status } = req.body;
    let exisitingDoc = await Request.findOneAndUpdate(
      { _id: requestId, 'documents.doc_id': doc_id },
      { 'documents.$.status': status },
      { new: true }
    );
    res.status(200).json({ success: true, requet: exisitingDoc });
  } catch (err) {
    console.log('Error---->', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * validate Product Document
 * @param {object} req
 * @param {object} res
 */

exports.validateProductDoc = async (req, res) => {
  try {
    const { productId } = req.params;
    let exisitingProduct = await Products.findById(productId);
    if (!exisitingProduct) {
      res.status(404).json({ success: false, message: 'Product Not Found' });
    }
    if (req.body.technical_sheet) {
      exisitingProduct.technical_sheet.status = req.body.technical_sheet.status;
    }
    if (req.body.test_report) {
      exisitingProduct.test_report.status = req.body.test_report.status;
    }
    if (req.body.analysis_certificate) {
      exisitingProduct.analysis_certificate.status = req.body.analysis_certificate.status;
    }
    if (req.body.plan) {
      exisitingProduct.plan.status = req.body.plan.status;
    }
    if (req.body.other_docs) {
      exisitingProduct.other_docs.status = req.body.other_docs.status;
    }
    await exisitingProduct.save();
    res.status(200).json({ success: true, product: exisitingProduct });
  } catch (err) {
    console.log('Error---->', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *  Request-Missing-Docs
 * @param {object} req
 * @param {object} res
 */

exports.ReqmissingDocs = async (req, res) => {
  try {
    const { requestId } = req.params;
    const exitingRequest = await Request.findById(requestId);
    if (!exitingRequest) {
      return res.status(404).json({ success: false, message: 'Request Not Found ' });
    }
    req.body.countries = [exitingRequest.country];
    const new_doc = await Documents.create(req.body);
    exitingRequest.missing_docs.push(new_doc._id);
    await exitingRequest.save();
    return res.status(202).json({ success: false, message: 'Missing Doc Updated ', exitingRequest });
  } catch (err) {
    console.log('Error---->', err);
    res.status(5000).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Product-Missing-Docs
 * @param {object} req
 * @param {object} res
 */

exports.ProductmissingDocs = async (req, res) => {
  try {
    const { productId } = req.params;
    const exitingProduct = await Products.findById(productId);
    if (!exitingProduct) {
      return res.status(404).json({ success: false, message: 'Not Found ' });
    }
    req.body.countries = [exitingProduct.country];
    const new_doc = await Documents.create(req.body);
    exitingProduct.missing_docs.push(new_doc._id);
    await exitingProduct.save();
    return res.status(202).json({ success: false, message: 'Missing Doc Updated ', exitingProduct });
  } catch (err) {
    console.log('Error---->', err);
    res.status(5000).json({ success: false, message: 'Internal Server Error' });
  }
};
