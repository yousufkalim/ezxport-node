/**
 * buyers CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const buyers = require('../controllers/buyers');
const { validateBuyer, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post buyers create
 * @method get get all buyers
 * @method get get buyersby id
 * @method put update buyers
 * @method delete delete buyers
 */

// Create - buyersyo
router.post('/', validateBuyer, isValidated, buyers.create);
// Read
router.get('/', buyers.getAll); // Get all buyersat once
router.get('/:buyerId', buyers.getById); // Get one buyersby it's id
// Update
router.put('/:buyerId', validateBuyer, isValidated, buyers.update); // Update a specific buyersby it's id
// Delete
router.delete('/:buyerId', buyers.delete); // delete a specific buyersby it's id

// Export
module.exports = router;
