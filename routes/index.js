/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require('express').Router();

// Parent Routes
router.use('/admins', require('./admins')); // All the user routes
router.use('/users', require('./users')); // All the user routes
router.use('/auth', require('./auth')); // All the auth routes
router.use('/countries', require('./countries')); //All the countries routes
router.use('/serviceproviders', require('./serviceproviders')); //All the countries routes

// Export
module.exports = router;
