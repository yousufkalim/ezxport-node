/**
 * serviceProvider CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const serviceProviders = require('../controllers/serviceProviders');
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
router.post('/', validateServiceProvider, isValidated, serviceProviders.create);
// Read
router.get('/', serviceProviders.getAll); // Get all serviceProvider at once
router.get('/getByCountryId/:associated_countryId', serviceProviders.getByCountryId); // Get  serviceProvider  by countryId
router.get('/:serviceProviderId', serviceProviders.getById); // Get one serviceProvider by it's id

// Update
router.put('/:serviceProviderId', validateServiceProvider, isValidated, serviceProviders.update); // Update a specific serviceProvider by it's id

// Delete
router.delete('/:serviceProviderId', serviceProviders.delete); // delete a specific serviceProvider by it's id

// Export
module.exports = router;
