/**
 * All the validation
 * @author Yousuf Kalim
 */
const { check, validationResult } = require('express-validator');

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// User Signup Validation
exports.validateUser = [
  check('firstName', 'firstName name is required.').notEmpty(),
  check('lastName', 'lastName name is required.').notEmpty(),
  check('email', 'Email is required.').notEmpty().isEmail().trim(),
  check('password', 'Password is required.')
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password min length must be 6 characters'),
  check('confirm_password', 'Confirm Password is required')
    .notEmpty()
    .trim()
    .isLength({ min: 4 })
    .withMessage('Confirm Password min length must be 6 characters')
    .custom(async (confirmPassword, { req }) => {
      const password = req.body.password;

      if (password !== confirmPassword) {
        throw new Error('Password and Confirm Password must be same');
      }
    }),
  check('phone', 'Telephone is required.').notEmpty().trim(),
  check('fullAddress', 'FullAddress is required.').notEmpty().trim(),
  check('town', 'Town is required.').notEmpty().trim(),
  check('postelCode', 'PostelCode is required.').notEmpty().trim().isLength({ min: 5, max: 5 }),
  check('companyInformation_lastName', 'CompanyInformation-lastName is required.').notEmpty().trim(),
  check('typeOfSociety', 'Type Of Society is required.').notEmpty().trim(),
  check('VatNumber', 'VatNumber is required.').notEmpty().trim(),
];

// User Signup Validation
exports.validateUserUpdate = [
  check('name', 'Name is required.').notEmpty().trim(),
  check('email', 'Email is required.').notEmpty().isEmail().trim(),
  check('number', 'Number is required.').notEmpty().isNumeric().trim(),
  check('gender').trim(),
  check('role').trim(),
  check('address').trim(),
  check('city').trim(),
  check('country').trim(),
];
//create country validation
exports.validateCountry = [check('name', 'Country Name is required.').notEmpty().trim()];
//create serviceProvider
exports.validateServiceProvider = [
  check('phone', 'phone number is required.').notEmpty().trim(),
  check('name', 'name is required').notEmpty().trim(),
  check('sending_email', 'sending_email is required').notEmpty().isEmail().trim(),
  check('contact_email', 'contact_email is required').notEmpty().isEmail().trim(),
  check('associated_countries', 'associated_countries required').isArray({ min: 1 }),
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
