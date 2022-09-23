/**
 * Requets controllers
 * @author Shuja Naqvi
 */
const fs = require('fs');
const Documents = require('../models/Documents');
const Product = require('../models/Products');
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
const { sendRequestEmail } = require('../utils/sendRequestEmail');
const cron = require('node-cron');
const request = require('request');
const ZipStream = require('zip-stream');
const stripe = require('stripe')(process.env.SECRET_KEY);
const ObjectId = require('mongodb').ObjectID;
/**
 * Request  Create-Title
 *      Request
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
    if (!country.calculation) {
      return res.status(404).json({ success: false, message: 'Calculation of this country is null' });
    }
    if (!country.currency) {
      return res.status(404).json({ success: false, message: 'Currency of this country is null' });
    }
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
 *      Request
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
    const { user, certification_cost, country } = req.body;
    let existingUser = await Users.findOne({
      _id: user,
    });
    let existingCountry = await Country.findOne({
      _id: country,
    });
    if (!existingUser) {
      return res.status(409).json({ success: false, message: 'UserId is invalid' });
    }
    if (!existingCountry) {
      return res.status(409).json({ success: false, message: 'countryId is invalid' });
    }
    //If certification not required by all of documents
    // const certificationNotReq = codes.every(function (v) {
    //   const boolVal = JSON.parse(v.certification_required);
    //   return !boolVal;
    // });
    //If certification not required by all of documents
    //then set its request status will be not required
    //and cost value will be 0
    // if (certificationNotReq) {
    //   req.body.status = 'not required';
    //   req.body.certification_cost = { value: 0 };
    //   const request = await Request.create(req.body); // Adding seller in db
    //   existingUser.requests.push(request._id);
    //   await existingUser.save();
    //   return res.json({ success: true, request, message: 'certification not required' }); //Success
    // }
    //If certification  required by some of documents
    //then calculate monetory values for required codes
    // let value = 0;
    // for (let i = 0; i < codes.length; i++) {
    //   const boolVal = JSON.parse(codes[i].certification_required);
    //   if (boolVal) {
    //     value = +value + +codes[i].monetary_value; //To deal with coercion subtracted 0 from string :)
    //   }
    // }

    req.body.certification_cost = { value: certification_cost, currency: existingCountry.currency };
    req.body.status = 'Draft';
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
 * Request  First-Step
 *        BOM
 * @param {object} req
 * @param {object} res
 */
exports.calculateCost = async (req, res) => {
  try {
    const { codes, country } = req.body;
    const existingCountry = await Country.findById(country).populate('calculation');
    if (!existingCountry) {
      return res.json({ success: false, message: 'Country not found' });
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
      return res.json({ success: true, status: 'Not Required', certification_cost: 0, country: existingCountry.name }); //Success
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
    if (existingCountry.calculation) {
      if (existingCountry.calculation.type === 'coefficient') {
        console.log(existingCountry.calculation.min_threshold.value, 'existingCountry.calculation.min_threshold.value');
        if (existingCountry.calculation.min_threshold.value > value) {
          return res.json({ success: true, status: 'Not Required', certification_cost: value, country: existingCountry.name }); //Success
        }
        const coefficientMultiple = (+existingCountry.calculation.coefficient * value) / 100;

        if (coefficientMultiple < existingCountry.calculation.min_cost.value) {
          return res.json({
            success: true,
            status: 'Required',
            certification_cost: existingCountry.calculation.min_cost.value,
            country: existingCountry.name,
          }); //Success
        } else if (coefficientMultiple > existingCountry.calculation.max_cost.value) {
          return res.json({
            success: true,
            status: 'Required',
            certification_cost: existingCountry.calculation.max_cost.value,
            country: existingCountry.name,
          }); //Success
        } else {
          return res.json({
            success: true,
            status: 'Required',
            certification_cost: coefficientMultiple,
            country: existingCountry.name,
          }); //Success
        }
      } else if (existingCountry.calculation.type === 'range') {
        for (let i = 0; i < existingCountry.calculation.range.length; i++) {
          if (existingCountry.calculation.range[i].min <= value && value <= existingCountry.calculation.range[i].max) {
            return res.json({
              success: true,
              status: 'Required',
              certification_cost: existingCountry.calculation.range[i].certificate_cost,
              country: existingCountry.name,
            }); //Success
          }
        }
        let range = existingCountry.calculation.range;
        let maxObj = range[0];
        let minObj = range[0];
        let tempMax = range[0].max;
        let tempMin = range[0].min;
        for (let i = 0; i < range.length; i++) {
          if (range[i].max > tempMax) {
            maxObj = range[i];
            tempMax = range[i].max;
          }
          if (range[i].min < tempMin) {
            minObj = range[i];
            tempMin = range[i].min;
          }
        }
        if (value < tempMin) {
          return res.json({
            success: true,
            status: 'Required',
            certification_cost: minObj.certificate_cost,
            country: existingCountry.name,
          }); //Success
        } else if (value > tempMax) {
          return res.json({
            success: true,
            status: 'Required',
            certification_cost: maxObj.certificate_cost,
            country: existingCountry.name,
          }); //Success
        }
      }
    }
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
    const { certification_cost, country } = req.body;
    let existingCountry = await Country.findOne({
      _id: country,
    });
    if (!existingCountry) {
      return res.status(409).json({ success: false, message: 'countryId is invalid' });
    }
    //If certification not required by all of documents
    // const certificationNotReq = codes.every(function (v) {
    //   const boolVal = JSON.parse(v.certification_required);
    //   return !boolVal;
    // });
    //If certification not required by all of documents
    //then set its request status will be not required
    //and cost value will be 0
    // if (certificationNotReq) {
    //   req.body.status = 'not required';
    //   req.body.certification_cost = { value: 0 };
    //   const request = await Request.findByIdAndUpdate(requestId, req.body, { new: true }); // Adding seller in db
    //   return res.json({ success: true, request }); //Success
    // }
    //If certification  required by some of documents
    //then calculate monetory values for required codes
    // let value = 0;
    // for (let i = 0; i < codes.length; i++) {
    //   const boolVal = JSON.parse(codes[i].certification_required);
    //   if (boolVal) {
    //     value = +value + +codes[i].monetary_value; //To deal with coercion subtracted 0 from string :)
    //   }
    // }
    req.body.certification_cost = { value: certification_cost, currency: existingCountry.currency };
    req.body.status = 'Draft';
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
    const { vendor, user, request } = req.body;
    const contact_info = JSON.parse(req.body.contact_info);
    if (contact_info) {
      if (!req.body.contact_fname || !req.body.contact_fname || !req.body.contact_email) {
        return res.status(409).json({ success: false, message: 'all fields required in contact information section' });
      }
    }
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
    if (existingUserVendor && contact_info) {
      existingUserVendor.contact_fname = req.body.contact_fname;
      existingUserVendor.contact_lname = req.body.contact_lname;
      existingUserVendor.contact_email = req.body.contact_email;
      await existingUserVendor.save();
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
    const { place, seller, buyer, request, inspection_date } = req.body;
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
    existingRequest.inspection_date = new Date(inspection_date);
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
    const existingReq = await Request.findOne({ _id: request }).populate('country');
    let updateRequest;
    for (let i = 0; i < codes.length; i++) {
      const price = { value: codes[i].price, currency: existingReq.country.currency };
      codes[i].price = price;
      codes[i].request = request;
      const product = await CreateProduct(codes[i]);
      updateRequest = await Request.findOneAndUpdate(
        { _id: request, 'codes.code': codes[i].code },
        { $push: { 'codes.$.products': product._id } },
        { new: true }
      );
    }
    res.status(200).json({ success: true, request: updateRequest });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 *   5th-Step
 *  send Email
 * @param {object} req
 * @param {object} res
 */
exports.sendEmail = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    let findReq = await Request.findById(requestId)
      .populate('user')
      .populate('country')
      .populate('missing_docs')
      .populate({
        path: 'vendor',
        populate: {
          path: 'vendor',
        },
      })
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
    await sendRequestEmail(findReq);
    findReq.status = 'Sent';
    findReq.request_method = 'direct';
    await findReq.save();
    return res.json({ success: true, message: 'Email has been sent to vendor' });
    // let updateRequest;
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
    await Request.findOneAndUpdate({ _id: requestId }, { $pull: { missing_docs: doc_id } });
    //Check if request has create document with one file atleast...?
    let exisitingDoc = await Request.findOne({ _id: requestId, 'documents.doc_id': doc_id });
    // if document with provided id is not created
    if (!exisitingDoc) {
      const documentObj = {
        doc_id: doc_id,
        url: [file],
        status: 'Sent',
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
    const requests = await Request.find({ status: { $ne: 'Draft' } })
      .populate('user')
      .populate('country')
      .populate('missing_docs')
      .populate({
        path: 'vendor',
        populate: {
          path: 'vendor',
        },
      })
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate({
        path: 'codes.products',
      })
      .populate('codes.code')
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
    const filteredRequest = requests.filter((e) => e.user.delete === false);
    res.status(200).json({ success: true, requets: filteredRequest });
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
    const request = await Request.find({ user: userId, status: { $ne: 'Draft' } })
      .populate('user')
      .populate('country')
      .populate('missing_docs')
      .populate({
        path: 'vendor',
        populate: {
          path: 'vendor',
        },
      })
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate({
        path: 'codes.products',
      })
      .populate('codes.code')
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
    res.status(200).json({ success: true, request: request });
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
    const request = await Request.find({ country: countryId, status: { $ne: 'Draft' } })
      .populate('user')
      .populate('country')
      .populate('missing_docs')
      .populate({
        path: 'vendor',
        populate: {
          path: 'vendor',
        },
      })
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate({
        path: 'codes.products',
      })
      .populate('codes.code')
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
    const filteredRequest = request.filter((e) => e.user.delete === false);
    res.status(200).json({ success: true, request: filteredRequest });
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
      .populate({
        path: 'vendor',
        populate: {
          path: 'vendor',
        },
      })
      .populate('place')
      .populate('buyer')
      .populate('seller')
      .populate({
        path: 'codes.products',
      })
      .populate('codes.code')
      .populate({
        path: 'documents',
        populate: {
          path: 'doc_id',
        },
      });
    res.status(200).json({ success: true, request: request });
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
    res.status(200).json({ success: true, request: exisitingDoc });
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

exports.ProductdocumentsUpload = async (req, res) => {
  try {
    const { productId } = req.params;
    var file = '';
    let exisitingProduct = await Products.findById(productId);
    if (!exisitingProduct) {
      res.status(404).json({ success: false, message: 'Product Not Found' });
    }
    //If missing_docs has doc_id then pull it
    await Products.findByIdAndUpdate(productId, { $pull: { missing_docs: { _id: ObjectId(req.body.doc_id) } } });
    if (req.file) {
      file = req.file.path;
      if (req.body.technical_sheet) {
        exisitingProduct.technical_sheet.url.push(file);
      }
      if (req.body.test_report) {
        exisitingProduct.test_report.url.push(file);
      }
      if (req.body.analysis_certificate) {
        exisitingProduct.analysis_certificate.url.push(file);
      }
      if (req.body.plan) {
        exisitingProduct.plan.url.push(file);
      }
      if (req.body.other_docs) {
        exisitingProduct.other_docs.url.push(file);
      }
      await exisitingProduct.save();
      return res.status(200).json({ success: true, product: exisitingProduct });
    }
    res.status(200).json({ success: true, message: 'No File Added' });
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
    const { documents, products, admin_remarks } = req.body;
    const exitingRequest = await Request.findById(requestId);
    if (!exitingRequest) {
      return res.status(404).json({ success: false, message: 'Request Not Found ' });
    }
    exitingRequest.admin_remarks = admin_remarks;
    await exitingRequest.save();
    for (let i = 0; i < documents.length; i++) {
      documents[i].countries = [exitingRequest.country];
      const new_doc = await Documents.create(documents[i]);
      const docObj = {
        status: 'Missing documents',
        url: [],
        doc_id: new_doc._id,
      };
      exitingRequest.missing_docs.push(new_doc._id);
      exitingRequest.documents.push(docObj);
      exitingRequest.status = 'Missing documents';
      await exitingRequest.save();
    }

    for (let i = 0; i < products.length; i++) {
      const missingDocObj = {
        name: products[i].name,
        _id: ObjectId(),
      };
      const exitingProduct = await Products.findById(products[i].product);
      exitingProduct.missing_docs.push(missingDocObj);
      exitingRequest.status = 'Missing documents';
      await exitingProduct.save();
      await exitingRequest.save();
    }
    return res.status(202).json({ success: true, message: 'Missing Doc Updated ', exitingRequest });
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
      return res.status(404).json({ success: false, message: 'Product Not Found ' });
    }
    const exitingRequest = await Request.findById(exitingProduct.request);
    if (!exitingRequest) {
      return res.status(404).json({ success: false, message: 'Request Not Found ' });
    }
    req.body.countries = [exitingRequest.country];
    const new_doc = await Documents.create(req.body);
    exitingProduct.missing_docs.push(new_doc._id);
    exitingRequest.status = 'Product Documents Missing';
    await exitingProduct.save();
    return res.status(202).json({ success: true, message: 'Missing Doc Updated ', exitingProduct });
  } catch (err) {
    console.log('Error---->', err);
    res.status(5000).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Validated By Admin
 * @param {object} req
 * @param {object} res
 */

exports.validateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const exitingRequest = await Request.findById(requestId);
    if (!exitingRequest) {
      return res.status(404).json({ success: false, message: 'Request Not Found' });
    }
    exitingRequest.status = 'Validated';
    await exitingRequest.save();
    return res.status(202).json({ success: true, exitingRequest });
  } catch (err) {
    console.log('Error---->', err);
    res.status(5000).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Create Product from iteration
 * @param {object} req
 * @param {object} res
 */

const CreateProduct = async (Product) => {
  try {
    if (Product.technical_sheet) {
      let filePaths = [];
      for (let i = 0; i < Product.technical_sheet.url.length; i++) {
        const file = Product.technical_sheet.url[i];
        const fileExt = fileExtension(file);
        const bitmap = new Buffer(file, 'base64');
        const filePath = `./uploads/${Date.now()}-technical_sheet${i}-file-.${fileExt}`;
        fs.writeFileSync(filePath, bitmap);
        filePaths.push(filePath.substring(2));
      }
      Product.technical_sheet.url = filePaths;
      Product.technical_sheet.status = 'Sent';
    }
    if (Product.test_report) {
      let filePaths = [];
      for (let i = 0; i < Product.test_report.url.length; i++) {
        const file = Product.test_report.url[i];
        const fileExt = fileExtension(file);
        const bitmap = new Buffer(file, 'base64');
        const filePath = `./uploads/${Date.now()}-test_report${i}-file-.${fileExt}`;
        fs.writeFileSync(filePath, bitmap);
        filePaths.push(filePath.substring(2));
      }
      Product.test_report.url = filePaths;
      Product.test_report.status = 'Sent';
    }
    if (Product.plan) {
      let filePaths = [];
      for (let i = 0; i < Product.plan.url.length; i++) {
        const file = Product.plan.url[i];
        const fileExt = fileExtension(file);
        const bitmap = new Buffer(file, 'base64');
        const filePath = `./uploads/${Date.now()}-plan${i}-file-.${fileExt}`;
        fs.writeFileSync(filePath, bitmap);
        filePaths.push(filePath.substring(2));
      }
      Product.plan.url = filePaths;
      Product.plan.status = 'Sent';
    }
    if (Product.other_docs) {
      let filePaths = [];
      for (let i = 0; i < Product.other_docs.url.length; i++) {
        const file = Product.other_docs.url[i];
        const fileExt = fileExtension(file);
        const bitmap = new Buffer(file, 'base64');
        const filePath = `./uploads/${Date.now()}-other_docs${i}-file-.${fileExt}`;
        fs.writeFileSync(filePath, bitmap);
        filePaths.push(filePath.substring(2));
      }
      Product.other_docs.url = filePaths;
      Product.other_docs.status = 'Sent';
    }
    if (Product.analysis_certificate) {
      let filePaths = [];
      for (let i = 0; i < Product.analysis_certificate.url.length; i++) {
        const file = Product.analysis_certificate.url[i];
        const fileExt = fileExtension(file);
        const bitmap = new Buffer(file, 'base64');
        const filePath = `./uploads/${Date.now()}-analysis_certificate${i}-file-.${fileExt}`;
        fs.writeFileSync(filePath, bitmap);
        filePaths.push(filePath.substring(2));
      }
      Product.analysis_certificate.url = filePaths;
      Product.analysis_certificate.status = 'Sent';
    }
    const product = await Products.create(Product);
    return product;
  } catch (err) {
    console.log('Error---->', err);
  }
};
/**
 *
 * Find Extension of file
 * @param {object} req
 * @param {object} res
 */
const fileExtension = (fileBase64) => {
  let fileHeader = new Map();
  //get the first 3 char of base64
  fileHeader.set('/9j', 'jpg');
  fileHeader.set('iVB', 'png');
  fileHeader.set('Qk0', 'bmp');
  fileHeader.set('SUk', 'tiff');
  fileHeader.set('JVB', 'pdf');
  fileHeader.set('UEs', 'docx');

  let res = '';

  fileHeader.forEach((v, k) => {
    if (k == fileBase64.substr(0, 3)) {
      res = v;
    }
  });

  //if file is not supported
  if (res == '') {
    res = 'pdf';
  }

  //return map value
  return res;
};

/**
 *
 * Proceed to payment
 * @param {object} req
 * @param {object} res
 */

exports.Checkout = async (req, res, next) => {
  try {
    let metaData = req.body.metaData;
    let lineItems = req.body.line_items; // => get the line items array from the resposne
    // => stripe api to create a checkout seesion url
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // => A list of the types of payment methods (e.g., card)
      line_items: lineItems, // => A list of items the customer is purchasing. For payment mode, there is a maximum of 100 line items
      locale: 'fr', // => The IETF language tag of the locale Checkout is displayed in.
      mode: 'payment', // => The mode of the Checkout Session. Possible type: payment, setup and subscription
      success_url: `${process.env.CLIENT_URL}/`, // => The URL the customer will be directed to if they decide to cancel payment and return to your website. example http://localhost:3001/home?success
      cancel_url: `${process.env.CLIENT_URL}/`, // => The URL to which Stripe should send customers when payment or setup is complete. If you’d like to use information from the successful Checkout Session on your page. example http://localhost:3001/not_home?reject
      metadata: metaData,
    });
    // => return the url of the checkout session page
    res.status(200).json({
      url: session.url,
    });
  } catch (err) {
    next(err);
  }
};

exports.Webhook = async (req, res) => {
  let sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.WEB_HOOK_KEY //////webhook scret key,
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      {
        const session = event.data.object;
        const metaData = session.metadata;
        const request = metaData.id;
        const findReq = await Request.findById(request);
        if (!findReq) return res.json({ success: false, message: 'RequestId is invalid' });
        findReq.status = 'Being checked by an expert';
        findReq.request_method = 'platform';
        findReq.certification_cost.value = +findReq.certification_cost.value + 50;
        await findReq.save();
      }
      break;
    default:
      console.trace(`Unhandled event type ${event.type}`);
  }
  res.send();
};

/**
 *
 * Create Zip
 * @param {object} req
 * @param {object} res
 */

exports.zipFile = async (req, res) => {
  try {
    const { requestId } = req.params;
    const existingRequest = await await Request.findById(requestId).populate('codes.products');
    if (!existingRequest) {
      return res.status(404).json({ success: false, message: 'Request not Found' });
    }
    var queue = []; //it will contain url of all docs with their names
    for (let i = 0; i < existingRequest.documents.length; i++) {
      //Finding all documents of request and push their urls in queue
      let doc = existingRequest.documents[i];
      for (let j = 0; j < doc.url.length; j++) {
        queue.push({ url: `${process.env.BASE_URL}/${doc.url[j]}`, name: doc.url[j] });
      }
    }
    for (let i = 0; i < existingRequest.codes.length; i++) {
      let code = existingRequest.codes[i];
      //Finding all products of request and push their urls in queue
      for (let j = 0; j < code.products.length; j++) {
        let product = code.products[j];
        //push url of each sheet
        product.technical_sheet.url.map((e) => {
          queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
        });
        product.test_report.url.map((e) => {
          queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
        });
        product.analysis_certificate.url.map((e) => {
          queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
        });
        product.plan.url.map((e) => {
          queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
        });
        product.other_docs.url.map((e) => {
          queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
        });
        //other_docs
      }
    }
    var zip = new ZipStream();
    zip.pipe(res);

    function addNextFile() {
      var elem = queue.shift();
      var stream = request(elem.url);
      zip.entry(stream, { name: elem.name }, (err) => {
        if (err) throw err;
        if (queue.length > 0) addNextFile();
        else zip.finalize();
      });
    }
    addNextFile();
  } catch (err) {
    console.log('Error---->', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Create Zip of a specific document
 * @param {object} req
 * @param {object} res
 */

exports.zipFileDocument = async (req, res) => {
  try {
    const { requestId, doc_id } = req.params;
    const existingRequest = await await Request.findById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ success: false, message: 'Request not Found' });
    }
    var queue = []; //it will contain url of all docs with their names
    const filteredDocs = existingRequest.documents.filter((e) => e.doc_id.toString() === doc_id.toString());
    for (let i = 0; i < filteredDocs[0].url.length; i++) {
      //Finding all documents of request and push their urls in queue
      queue.push({ url: `${process.env.BASE_URL}/${filteredDocs[0].url[i]}`, name: filteredDocs[0].url[i] });
    }
    var zip = new ZipStream();
    zip.pipe(res);
    function addNextFile() {
      var elem = queue.shift();
      var stream = request(elem.url);
      zip.entry(stream, { name: elem.name }, (err) => {
        if (err) throw err;
        if (queue.length > 0) addNextFile();
        else zip.finalize();
      });
    }
    addNextFile();
  } catch (err) {
    console.log('Error---->', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Create Zip of a specific Code(zip of all products)
 * @param {object} req
 * @param {object} res
 */

exports.zipFileCode = async (req, res) => {
  try {
    const { requestId, code_id } = req.params;
    const existingRequest = await await Request.findById(requestId).populate('codes.products');

    if (!existingRequest) {
      return res.status(404).json({ success: false, message: 'Request not Found' });
    }

    var queue = []; //it will contain url of all docs with their names
    const filteredDocs = existingRequest.codes.filter((e) => e.code.toString() === code_id.toString());
    for (let i = 0; i < filteredDocs[0].products.length; i++) {
      //Finding all documents of request and push their urls in queue
      let product = filteredDocs[0].products[i];
      product.technical_sheet.url.map((e) => {
        queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
      });
      product.test_report.url.map((e) => {
        queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
      });
      product.analysis_certificate.url.map((e) => {
        queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
      });
      product.plan.url.map((e) => {
        queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
      });
      product.other_docs.url.map((e) => {
        queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
      });
    }
    var zip = new ZipStream();
    zip.pipe(res);
    function addNextFile() {
      var elem = queue.shift();
      var stream = request(elem.url);
      zip.entry(stream, { name: elem.name }, (err) => {
        if (err) throw err;
        if (queue.length > 0) addNextFile();
        else zip.finalize();
      });
    }
    addNextFile();
  } catch (err) {
    console.log('Error---->', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Create Zip of a specific Product
 * @param {object} req
 * @param {object} res
 */

exports.zipFileProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const existingProduct = await await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not Found' });
    }

    var queue = []; //it will contain url of all docs with their names
    //Finding all documents of request and push their urls in queue
    existingProduct.technical_sheet.url.map((e) => {
      queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
    });
    existingProduct.test_report.url.map((e) => {
      queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
    });
    existingProduct.analysis_certificate.url.map((e) => {
      queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
    });
    existingProduct.plan.url.map((e) => {
      queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
    });
    existingProduct.other_docs.url.map((e) => {
      queue.push({ url: `${process.env.BASE_URL}/${e}`, name: e });
    });

    var zip = new ZipStream();
    zip.pipe(res);
    function addNextFile() {
      var elem = queue.shift();
      var stream = request(elem.url);
      zip.entry(stream, { name: elem.name }, (err) => {
        if (err) throw err;
        if (queue.length > 0) addNextFile();
        else zip.finalize();
      });
    }
    addNextFile();
  } catch (err) {
    console.log('Error---->', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Return Single Request Format
 * @param {object} req
 * @param {object} res
 */

exports.returnFormatedRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const existingRequest = await Request.findById(requestId)
      .populate('documents.doc_id')
      .populate('codes.code')
      .populate('codes.products');
    if (!existingRequest) {
      return res.status(404).json({ success: false, message: 'Request not Found' });
    }
    const requiredDocuments = existingRequest.documents.filter((e) => e.url.length > 0);
    const requiredCodes = existingRequest.codes.filter((e) => e.products.length > 0);
    const requiredFormat = {
      requestId: existingRequest._id,
      title: existingRequest.title,
      documents: requiredDocuments,
      codes: requiredCodes,
    };
    return res.json({ success: true, Request: requiredFormat });
  } catch (err) {
    console.log('Error---->', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Return Multiple  Request Format
 * @param {object} req
 * @param {object} res
 */

exports.returnMultipleFormatedRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    let data = [];
    const existingRequests = await Request.find({ user: userId })
      .populate('documents.doc_id')
      .populate('codes.code')
      .populate('codes.products');
    if (existingRequests.length < 1) {
      return res.status(404).json({ success: false, message: 'Request not Found' });
    }
    for (i = 0; i < existingRequests.length; i++) {
      let existingRequest = existingRequests[i];
      const requiredDocuments = existingRequest.documents.filter((e) => e.url.length > 0);
      const requiredCodes = existingRequest.codes.filter((e) => e.products.length > 0);
      const requiredFormat = {
        requestId: existingRequest._id,
        title: existingRequest.title,
        documents: requiredDocuments,
        codes: requiredCodes,
      };
      data.push(requiredFormat);
    }

    return res.json({ success: true, Request: data });
  } catch (err) {
    console.log('Error---->', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *  Upload-Missing-Docs
 * @param {object} req
 * @param {object} res
 */

exports.UploadmissingDocs = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { documents, products } = req.body;
    const exitingRequest = await Request.findById(requestId);
    if (!exitingRequest) {
      return res.status(404).json({ success: false, message: 'Request Not Found ' });
    }

    for (let i = 0; i < documents.length; i++) {
      //If missing_docs has doc_id then pull it
      const doc_id = documents[i].doc_id;
      const files = documents[i].files;
      await Request.findOneAndUpdate({ _id: requestId }, { $pull: { missing_docs: doc_id } });
      // if document with provided id is not created
      const urls = await SaveFile(files);
      const documentObj = {
        doc_id: doc_id,
        url: urls,
        status: 'sent',
      };
      await Request.findOneAndUpdate({ _id: requestId }, { $push: { documents: documentObj } }, { new: true });
    }

    for (let i = 0; i < products.length; i++) {
      const productId = products[i].productId;
      const objId = products[i].obj_id;
      const files = products[i].files;
      const urls = await SaveFile(files);
      //If missing_docs has doc_id then pull it
      let product = await Products.findByIdAndUpdate(productId, { $pull: { missing_docs: { _id: ObjectId(objId) } } });
      if (product) {
        product.other_docs.url.push(...urls);
        product.other_docs.status = 'sent';
        await product.save();
      }
    }
    exitingRequest.status = 'Sent';
    await exitingRequest.save();
    return res.status(202).json({ success: true, message: 'Missing Doc Updated ' });
  } catch (err) {
    console.log('Error---->', err);
    res.status(5000).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 *
 * Create Product from iteration
 * @param {object} req
 * @param {object} res
 */

const SaveFile = async (urls) => {
  try {
    let filePaths = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const file = url;
      const fileExt = fileExtension(file);
      const bitmap = new Buffer(file, 'base64');
      const filePath = `./uploads/${Date.now()}-missingDocs${i}-file-.${fileExt}`;
      fs.writeFileSync(filePath, bitmap);
      filePaths.push(filePath.substring(2));
    }
    return filePaths;
  } catch (err) {
    console.log('Error---->', err);
  }
};

//cron-job that will run after every 10days to delete requests with draft sttaus
cron.schedule('0 5 */10 * *', async () => {
  await Request.deleteMany({
    status: 'Draft',
  });
});
