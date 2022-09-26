/**
 * serviceProvider CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const vendors = require('../controllers/vendors');
const { validateServiceProvider, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post serviceProvider create
 * @method get get all serviceProvider
 * @method get get serviceProvider by id
 * @method put update serviceProvider
 * @method delete delete serviceProvider
 */

// Create - serviceProvider Signup
router.post('/', validateServiceProvider, isValidated, vendors.create);
// Read
router.get('/', vendors.getAll); // Get all serviceProvider at once
router.get('/userVendor/:userId', vendors.getuserVendor); // Get all serviceProvider at once
router.get('/getByCountryId/:associated_countryId', vendors.getByCountryId); // Get  serviceProvider  by countryId
router.get('/:serviceProviderId', vendors.getById); // Get one serviceProvider by it's id

// Update
router.put('/userVendors/:userVendorId', vendors.updateUserVendor); // Update a specific serviceProvider by it's id
router.put('/:serviceProviderId', validateServiceProvider, isValidated, vendors.update); // Update a specific serviceProvider by it's id

// Delete
router.delete('/:serviceProviderId', vendors.delete); // delete a specific serviceProvider by it's id

// Export
module.exports = router;
