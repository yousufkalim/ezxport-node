/**
 * Countries CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const countries = require('../controllers/countries');
const { validateCountry, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post country create
 * @method get get all countries
 * @method get get country by id
 * @method put update country
 * @method delete delete country
 */

// Create - country Signup
router.post('/', validateCountry, isValidated, countries.create);
// Read
router.get('/', countries.getAll); // Get all countries at once
router.get('/:countryId', validateCountry, countries.getById); // Get one country by it's id

// Update
router.put('/:countryId', isValidated, isValidated, countries.update); // Update a specific country by it's id

// Delete
router.delete('/:countryId', countries.delete); // delete a specific country by it's id

// Export
module.exports = router;
