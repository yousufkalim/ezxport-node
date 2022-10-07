/**
 * Check auth middleware
 * @author Shuja Naqvi
 */
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.JWT_SECRET;
const Users = require('../models/Users');

// Check auth
exports.userAuth = async (req, res, next) => {
  // Get token from Header
  const header = req.get('Authorization');

  // Check if not token
  if (!header || !header.startsWith('Bearer')) {
    return res.status(403).json({
      success: false,
      message: 'No token found, Authorization denied'
    });
  }

  try {
    // Decrypting token
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, tokenSecret);

    if (!decoded.user) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource'
      });
    }

    const existingUser = await Users.findOne({ _id: decoded.user._id });
    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource'
      });
    }

    req.user = decoded.user;
    req.token = token;

    // If user authenticated
    res.set(
      'cache-control',
      'no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0'
    );

    // Done
    next();
  } catch (err) {
    // If not
    res.status(403).json({ success: false, message: 'Your session has been expired' });
  }
};
