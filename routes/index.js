/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require('express').Router();
router.get('/', (req, res) => {
  res.send('v1.0.0');
});

// Parent Routes
router.use('/admins', require('./admins')); // All the user routes
router.use('/users', require('./users')); // All the user routes
router.use('/auth', require('./auth')); // All the auth routes
router.use('/countries', require('./countries')); //All the countries routes
router.use('/vendors', require('./vendors')); //All the vendors routes
router.use('/buyers', require('./buyers')); //All the buyers routes
router.use('/sellers', require('./sellers')); //All the sellers routes
router.use('/places', require('./places')); //All the sellers routes
router.use('/boms', require('./boms')); //All the boms routes
router.use('/documents', require('./documents')); //All the documents routes
router.use('/calculations', require('./calculations')); //All the calculations routes
router.use('/requests', require('./requests')); //All the requests routes

// Export
module.exports = router;
