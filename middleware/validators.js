/**
 * All the validation
 * @author Yousuf Kalim
 */
const { check, validationResult } = require('express-validator');
const Request = require('../models/Requests');
var Existingrequest = {};

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// User Signup Validation
exports.validateUser = [
  check('first_name', 'firstName name is required.').notEmpty(),
  check('last_name', 'lastName name is required.').notEmpty(),
  check('email', 'Email is required.').notEmpty().isEmail().trim(),
  check('password', 'Password is required.')
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password min length must be 6 characters'),
  check('confirm_password', 'Confirm Password is required')
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage('Confirm Password min length must be 6 characters')
    .custom(async (confirmPassword, { req }) => {
      const password = req.body.password;
      if (password !== confirmPassword) {
        throw new Error('Password and Confirm Password must be same');
      }
    }),
  check('phone_number', 'phone_number is required.').notEmpty().trim(),
  check('address', 'address is required.').notEmpty().trim(),
  check('city', 'city is required.').notEmpty().trim(),
  check('zipcode', 'zipcode is required.').notEmpty().trim().isLength({ min: 5, max: 5 }),
  check('company.name', 'company name is required.').notEmpty().trim(),
  check('company.type', 'company type is required.').notEmpty().trim(),
  check('company.vat', 'vat is required.').notEmpty().trim(),
];

// User Signup Validation
exports.validateUserUpdate = [
  check('first_name', 'firstName name is required.').notEmpty(),
  check('last_name', 'lastName name is required.').notEmpty(),
  check('email', 'Email is required.').notEmpty().isEmail().trim(),
  check('phone_number', 'phone_number is required.').notEmpty().trim(),
  check('address', 'address is required.').notEmpty().trim(),
  check('city', 'city is required.').notEmpty().trim(),
  check('zipcode', 'zipcode is required.').notEmpty().trim().isLength({ min: 5, max: 5 }),
  check('company.name', 'company name is required.').notEmpty().trim(),
  check('company.type', 'company type is required.').notEmpty().trim(),
  check('company.vat', 'vat is required.').notEmpty().trim(),
];
//create country validation
exports.validateCountry = [check('name', 'Country Name is required.').notEmpty().trim()];
//create Document
exports.validateDocument = [
  check('name', 'name is required').notEmpty().trim(),
  check('countries', 'countries required').isArray({ min: 1 }),
];
//validate FindbyCountry
exports.validateCountryUser = [
  check('country', 'country_id is required').notEmpty().trim(),
  check('user', 'userId required').notEmpty().trim(),
];
//validate FindbyCountry
exports.validateCountryID = [check('country', 'country_id is required').notEmpty().trim()];
//Frist Step of Request
exports.validateRequestBom = [
  check('country', 'countryId is required').notEmpty().trim(),
  check('user', 'userId is required').notEmpty().trim(),
  check('title', 'title is required').notEmpty().trim(),
  check('codes', 'codes required ').isArray({ min: 1 }),
  check('codes.*.code', 'codeId is required').notEmpty().trim(),
  check('codes.*.monetary_value', 'monetory_value required').notEmpty().trim(),
  check('codes.*.certification_required', 'certification_required true/false').notEmpty().isBoolean().trim(),
];
//2nd Step of Request
exports.validaterRequestVendor = [
  check('user', 'userId required').notEmpty().trim(),
  check('request', 'requestId required').notEmpty().trim(),
  check('vendor', 'vendorId required').notEmpty().trim(),
];
//3rd Step of Request
exports.validateDispatch = [
  check('request', 'requestId required').notEmpty().trim(),
  check('buyer.phone_number', 'phone number is required.').notEmpty().trim(),
  check('buyer.company_name', 'company_name is required').notEmpty().trim(),
  check('buyer.email', 'email is required').notEmpty().isEmail().trim(),
  check('buyer.country', 'country required').notEmpty().trim(),
  check('buyer.city', 'city is required.').notEmpty().trim(),
  check('buyer.zipcode', 'zipcode is required.').notEmpty().trim(),
  check('buyer.address', 'address is required.').notEmpty().trim(),
  check('seller.phone_number', 'phone number is required.').notEmpty().trim(),
  check('seller.company_name', 'company_name is required').notEmpty().trim(),
  check('seller.email', 'email is required').notEmpty().isEmail().trim(),
  check('seller.country', 'country required').notEmpty().trim(),
  check('seller.city', 'city is required.').notEmpty().trim(),
  check('seller.zipcode', 'zipcode is required.').notEmpty().trim(),
  check('seller.address', 'address is required.').notEmpty().trim(),
  check('place.phone_number', 'phone number is required.').notEmpty().trim(),
  check('place.company_name', 'company_name is required').notEmpty().trim(),
  check('place.email', 'email is required').notEmpty().isEmail().trim(),
  check('place.country', 'country required').notEmpty().trim(),
  check('place.city', 'city is required.').notEmpty().trim(),
  check('place.zipcode', 'zipcode is required.').notEmpty().trim(),
  check('place.address', 'address is required.').notEmpty().trim(),
  check('place.conatct_fname', 'contact first name is required.').notEmpty().trim(),
  check('place.contact_name', 'Contact Name  is required.').notEmpty().trim(),
  check('inspection_date', 'inspection date required').toDate(),
];

//4th-step Documents
exports.ValidateDocuments = [
  check('request', 'requestId required ').notEmpty().trim(),
  check('codes', 'codes required ').isArray({ min: 1 }),
  check('codes.*.id', 'codeId required ').notEmpty().trim(),
  check('codes.*.user', 'userId required ').notEmpty().trim(),
  check('codes.*.name', 'name required ').notEmpty().trim(),
  check('codes.*.description', 'description required ').notEmpty().trim(),
  check('codes.*.condition', 'condition required ').notEmpty().trim(),
  check('codes.*.amount', 'amount required ').notEmpty().trim(),
  check('codes.*.unit', 'unit required ').notEmpty().trim(),
  check('codes.*.mark', 'mark required ').notEmpty().trim(),
  check('codes.*.builder', 'builder required ').notEmpty().trim(),
  check('codes.*.country', 'country required ').notEmpty().trim(),
  check('codes.*.price.currency', 'currency required ').notEmpty().trim(),
  check('codes.*.price.value', 'value required ').notEmpty().trim(),
];
//create serviceProvider
exports.validateServiceProvider = [
  check('phone_number', 'phone number is required.').notEmpty().trim(),
  check('name', 'name is required').notEmpty().trim(),
  check('sending_email', 'sending_email is required').notEmpty().isEmail().trim(),
  check('contact_email', 'contact_email is required').notEmpty().isEmail().trim(),
  check('countries', 'countries required').isArray({ min: 1 }),
];
//create AddressBook
exports.validateBuyer = [
  check('phone_number', 'phone number is required.').notEmpty().trim(),
  check('company_name', 'company_name is required').notEmpty().trim(),
  check('email', 'email is required').notEmpty().isEmail().trim(),
  check('country', 'country required').notEmpty().trim(),
  check('city', 'city is required.').notEmpty().trim(),
  check('zipcode', 'zipcode is required.').notEmpty().trim(),
  check('address', 'address is required.').notEmpty().trim(),
  check('user', 'UserId is required.').notEmpty().trim(),
];
//create AddressBook
exports.validatePlace = [
  check('phone_number', 'phone number is required.').notEmpty().trim(),
  check('company_name', 'company_name is required').notEmpty().trim(),
  check('email', 'email is required').notEmpty().isEmail().trim(),
  check('country', 'country required').notEmpty().trim(),
  check('city', 'city is required.').notEmpty().trim(),
  check('zipcode', 'zipcode is required.').notEmpty().trim(),
  check('address', 'address is required.').notEmpty().trim(),
  check('user', 'UserId is required.').notEmpty().trim(),
  check('contact_fname', 'contact first name is required.').notEmpty().trim(),
  check('contact_lname', 'Contact Name  is required.').notEmpty().trim(),
];
//create-Boms
exports.validateBoms = [
  check('code', 'code is required').notEmpty().trim(),
  check('certification_required', 'certification_required true/false').notEmpty().isBoolean().trim(),
  check('countries', 'countries required').isArray({ min: 1 }),
];
//create-Calculation
exports.validateCalculation = [
  check('type', 'type is not correct coefficient/range').notEmpty().isIn(['range', 'coefficient']).trim(),
  check('country', 'countryId required').notEmpty().trim(),
];
// Login validation
exports.validateLogin = [
  check('email', 'Email is required').notEmpty().isEmail().trim().toLowerCase(),
  check('password', 'Password is required.').notEmpty().trim().isLength({ min: 8 }),
];

// Change password validation
exports.changePasswordValidate = [
  // check("oldPassword", "Old Password is required.")
  //   .notEmpty()
  //   .trim()
  //   .isLength({ min: 8 }),
  check('newPassword', 'New password is required.').notEmpty().trim().isLength({ min: 8 }),
  check('confirmPassword', 'Confirm password is required.').notEmpty().trim().isLength({ min: 8 }),
  // .custom(async (confirmPassword, { req }) => {
  //   const password = req.body.password;

  //   if (password !== confirmPassword) {
  //     throw new Error("Password and Confirm Password must be same");
  //   }
  // }),
];

/*
======================
Result
======================
*/

/**
 * To check if request validated successfully or not, according to our validation strategies
 * @param {object} req
 * @param {object} res
 * @param {*} next
 */
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req); // Validating the request by previous middleware's strategy
  if (!errors.isEmpty()) {
    // On error
    res.status(400).send({ success: false, message: errors.array()[0] }); // Sending first error to the client from array of errors
  } else {
    // Validated successfully
    next(); // Pass the request to next middleware or controller
  }
};
