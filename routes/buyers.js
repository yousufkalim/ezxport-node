/**
 * buyers CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const buyers = require('../controllers/buyers');
const { validateBuyer, validateCountryUser, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post buyers create
 * @method get get all buyers
 * @method get get buyersby id
 * @method put update buyers
 * @method delete delete buyers
 */

// Create - buyers
router.post('/', validateBuyer, isValidated, buyers.create);
// Get-By-UserandCountry
router.post('/getByUserandCountry', validateCountryUser, isValidated, buyers.getByUserandCountry);
// Read
router.get('/', buyers.getAll); // Get all buyers at once
router.get('/getByUser/:userId', buyers.getByUser); // Get all buyers of a user
router.get('/:buyerId', buyers.getById); // Get one buyersby it's id
// Update
router.put('/:buyerId', validateBuyer, isValidated, buyers.update); // Update a specific buyersby it's id
// Delete
router.delete('/:buyerId', buyers.delete); // delete a specific buyersby it's id

// Export
module.exports = router;
