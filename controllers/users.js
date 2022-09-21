/**
 * User CRUD controllers
 * @author Yousuf Kalim
 */
const Users = require('../models/Users');
const Products = require('../models/Products');
const Sellers = require('../models/Sellers');
const Requests = require('../models/Requests');
const Admins = require('../models/Admins');
const Buyers = require('../models/Buyers');
const Places = require('../models/Places');
const Vendors = require('../models/UserVendors');
const bcrypt = require('bcryptjs');
const excelJS = require('exceljs');
const { sendQuestion } = require('../utils/sendEmail');
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email, password } = req.body; // Getting required fields from body
    const existingUser = await Users.findOne({ email }); // Finding already existing user
    const existingAdmin = await Admins.findOne({ email }); // Finding already existing user

    // Extra Validations
    if (existingUser || existingAdmin) {
      // If we found existing user in db
      if (existingUser.delete) {
        req.body.delete = false;
        req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
        if (req.file) {
          req.body.photo = req.file.path; // Creating a new property called photo in body object
        }
        const user = await Users.findOneAndUpdate({ email: email }, req.body, { new: true }); // Updating the user
        return res.json({ success: true, user }); //Success
      }
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    // Getting url of the image
    if (req.file) {
      req.body.photo = req.file.path; // Creating a new property called photo in body object
    }

    // Creating User
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    const user = await Users.create(req.body); // Adding user in db

    // Done
    res.json({ success: true, user }); //Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get all users
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Users.find({ delete: false }); // Finding all the users from db
    res.json({ success: true, users }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findById(userId); // Finding user by id
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    let { email } = req.body; // Getting required fields from body
    const existingUser = await Users.findOne({
      email: email,
    });
    if (existingUser) {
      if (existingUser._id != userId) {
        // If we found existing user in db
        return res.status(409).json({ success: false, message: 'Email already associated with another user' });
      }
    }

    // If user want to update it's password
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, parseInt(bcryptSalt));
    }

    const user = await Users.findByIdAndUpdate(userId, req.body, { new: true }); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findByIdAndDelete(userId); // Deleting the user
    if (user) {
      await Sellers.deleteMany({ _id: { $in: user.sellers } });
      await Buyers.deleteMany({ _id: { $in: user.buyers } });
      await Places.deleteMany({ _id: { $in: user.places } });
      await Vendors.deleteMany({ _id: { $in: user.vendors } });
      return res.json({ success: false, message: 'Successfully Deleted' }); // Success
    }
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Send Question
 * @param {object} req
 * @param {object} res
 */

exports.sendQuestion = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const { requestTitle, message, question } = req.body;
    const user = await Users.findById(userId); // Deleting the user
    if (!user) {
      return res.json({ success: false, message: 'User Not Found' }); // Success
    }
    const param = { email: user.email, title: requestTitle, question: question, message: message };
    sendQuestion(param).then((resp) => {
      res.json({ success: true, message: 'Question sent Successfully' }); // Success
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Create Excel Sheet
 * @param {object} req
 * @param {object} res
 */

exports.excelSheet = async (req, res) => {
  try {
    const users = await Users.find(); // Finding all the users from db
    const workbook = new excelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet(Date.now() + 'My Users'); // New Worksheet
    const filePath = `./uploads/${Date.now()}-My-User.xlsx`; // Path to download excel
    //Creating columns for Excel file
    worksheet.columns = [
      { header: 'No.', key: 's_no', width: 7 },
      { header: ' User Name', key: 'name', width: 25 },
      { header: 'Email ', key: 'email', width: 25 },
      { header: 'Phone Number', key: 'phone_number', width: 25 },
      { header: 'Address', key: 'address', width: 20 },
      { header: 'Zip Code', key: 'zipcode', width: 10 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Company', key: 'company_name', width: 20 },
    ];
    //counter for Index number of each row
    let counter = 1;
    for (let i = 0; i < users.length; i++) {
      let userObj = {
        s_no: counter,
        name: `${users[i].first_name}  ${users[i].last_name}`,
        email: users[i].email,
        phone_number: users[i].phone_number,
        address: users[i].address,
        zipcode: users[i].zipcode,
        city: users[i].city,
        company_name: users[i].company.name,
      };
      worksheet.addRow(userObj); // Add data in worksheet
      counter++;
    }

    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    //Writing file in uploads folder and sending url to user
    await workbook.xlsx.writeFile(`${filePath}`).then(() => {
      res.json({
        status: 'success',
        message: 'file saved',
        path: `${process.env.BASE_URL}/${filePath.substring(2)}`,
      });
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    //Vendors
    const userId = req.params.userId;
    const user = await Users.findByIdAndUpdate(userId, { delete: true }, { new: true });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User does not Found, could not delete',
      });
    }
    // if (user.buyers.length > 0) {
    //   await Buyers.deleteMany({
    //     _id: { $in: user.buyers },
    //   });
    // }
    // if (user.sellers.length > 0) {
    //   await Sellers.deleteMany({
    //     _id: { $in: user.sellers },
    //   });
    // }
    // if (user.places.length > 0) {
    //   await Places.deleteMany({
    //     _id: { $in: user.places },
    //   });
    // }
    // if (user.requests.length > 0) {
    //   await Requests.deleteMany({
    //     _id: { $in: user.requests },
    //   });
    //   await Products.deleteMany({
    //     request: { $in: user.requests },
    //   });
    // }
    // if (user.vendors.length > 0) {
    //   await Vendors.deleteMany({
    //     _id: { $in: user.vendors },
    //   });
    // }

    res.json({ success: true, user });
  } catch (err) {
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
