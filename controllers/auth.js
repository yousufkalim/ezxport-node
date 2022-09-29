/**
 * User auth controllers
 * @author Yousuf Kalim
 */
const Users = require('../models/Users');
const Admins = require('../models/Admins');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail');
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
exports.login = async (req, res) => {
  try {
    // Getting email and password
    const { email, password } = req.body;

    // Getting user from db
    let user = await Users.findOne({ email: email });
    let admin = await Admins.findOne({ email });
    if (!user && !admin) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user) {
      // Comparing password
      const isMatched = bcrypt.compareSync(password, user.password);

      if (!isMatched) {
        // If password not matched
        return res.status(400).json({ success: false, message: 'Invalid Password' });
      }
      // Creating payload with user object
      const role = 'user';
      user = {
        ...JSON.parse(JSON.stringify(user)),
      };

      delete user.password;
      const payload = { user };

      // Generating token
      jwt.sign(payload, tokenSecret, { expiresIn: '2h' }, (err, token) => {
        if (err) throw err;
        // done
        return res.json({ success: true, user, token, role });
      });
      return;
    }
    // Comparing password
    const isMatched = bcrypt.compareSync(password, admin.password);
    const role = 'admin';
    if (!isMatched) {
      // If password not matched
      return res.status(400).json({ success: false, message: 'Invalid Password' });
    }
    admin = {
      ...JSON.parse(JSON.stringify(admin)),
    };

    delete admin.password;
    const payload = { admin };

    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: '2h' }, (err, token) => {
      if (err) throw err;
      // done
      return res.json({ success: true, admin, token, role });
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Change Password
 * @param {object} req
 * @param {object} res
 */
exports.changePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password are not same',
      });
    }

    const decoded = jwt.verify(token, tokenSecret);
    let user = await Users.findOne({ email: decoded });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate token
    user.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));

    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
exports.forgot = async (req, res) => {
  try {
    let { email } = req.params;
    let user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let link = jwt.sign(user.email, tokenSecret);
    link = `${process.env.CLIENT_URL}/?reset=true&token=${link}`;

    // Sending email to user
    sendEmail(email, link)
      .then(async () => {
        // Done
        res.json({ success: true, message: 'Email sent successfully' });
      })
      .catch((err) => {
        // Error handling
        console.log('Error ----> ', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
      });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
/**
 * verify token
 * @param {object} req
 * @param {object} res
 */
exports.verifyToken = async (req, res) => {
  try {
    let { token } = req.params;
    const decoded = jwt.verify(token, tokenSecret);
    let user = await Users.findOne({ email: decoded });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Token is Invalid' });
    }

    res.json({ success: true, message: 'Token Verified' });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    return res.status(404).json({ success: false, message: 'Token is Invalid' });
  }
};

/**
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
exports.confirmAuth = async (req, res) => {
  // If user authenticated
  res.json({ success: true, user: req.user });
};
