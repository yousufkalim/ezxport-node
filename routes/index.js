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
router.use('/vendors', require('./vendors')); //All the countries routes
router.use('/buyers', require('./buyers')); //All the buyers routes
router.use('/sellers', require('./sellers')); //All the sellers routes
router.use('/places', require('./places')); //All the sellers routes
router.use('/boms', require('./boms')); //All the countries routes
router.use('/documents', require('./documents')); //All the countries routes

// Export
module.exports = router;
