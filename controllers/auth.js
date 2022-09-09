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
    const user = await Users.findOne({ email, active: true });
    const admin = await Admins.findOne({ email });
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
      const payload = { user };

      // Generating token
      jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        // done
        return res.json({ success: true, user, token, role: role });
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
    const payload = { admin };

    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      // done
      return res.json({ success: true, admin, token, role: role });
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

    // const isMatched = bcrypt.compareSync(oldPassword, user.password);

    // if (!isMatched) {
    //   return res.status(400).json({ success: false, message: "Invalid old Password" });
    // }

    // Generate token
    user.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));

    await user.save();

    res.json({ success: true, user });
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
    link = `${process.env.CLIENT_URL}/reset=true&token=${link}`;

    // Sending email to user
    sendEmail(email, link)
      .then(async () => {
        // If email is sent then we have to update the password in db
        // user.password = await bcrypt.hash(randomPassword, parseInt(bcryptSalt));
        // await user.save();

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
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
exports.confirmAuth = async (req, res) => {
  // If user authenticated
  res.json({ success: true, user: req.user });
};
