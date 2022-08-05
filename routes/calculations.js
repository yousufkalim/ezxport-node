/**
 * calculations CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const calculations = require('../controllers/calculations');
const { validateCalculation, validateRange, validateRangeId, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post calculations create
 * @method get get all calculations
 * @method get get calculation by id
 * @method put update calculation
 * @method delete delete calculation
 */

// Create - calculation
router.post('/', validateCalculation, isValidated, calculations.create);
// Read
router.get('/', calculations.getAll); // Get all Calculation at once
router.get('/getByCountryId/:countryId', calculations.getByCountryId); // Get  calculation  by countryId
router.get('/:calculationId', calculations.getById); // Get one Calculation sby it's id
// Update
router.put('/:calculationId', validateCalculation, isValidated, calculations.update); // Update a specific Calculation by it's id
//updateRange
router.put('/addRange/:calculationId', validateRange, isValidated, calculations.addRange); // Update a specific Calculation by it's id
//deleteRange
router.put('/deleteRange/:calculationId', validateRangeId, isValidated, calculations.deleteRange); // Update a specific Calculation by it's id
// Delete
router.delete('/:calculationId', calculations.delete); // delete a specific Calculation by it's id

// Export
module.exports = router;
