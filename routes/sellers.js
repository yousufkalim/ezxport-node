/**
 * sellers CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const sellers = require('../controllers/sellers');
const { validateBuyer, validateCountryUser, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post sellers create
 * @method get get all sellers
 * @method get get sellersby id
 * @method put update sellers
 * @method delete delete sellers
 */

// Create - sellersyo
router.post('/', validateBuyer, isValidated, sellers.create);
//getByUserandCountry
router.post('/getByUserandCountry', validateCountryUser, isValidated, sellers.getByUserandCountry);
// Read
router.get('/', sellers.getAll); // Get all sellersat once
router.get('/:sellerId', sellers.getById); // Get one sellersby it's id
// Update
router.put('/:sellerId', validateBuyer, isValidated, sellers.update); // Update a specific sellersby it's id
// Delete
router.delete('/:sellerId', sellers.delete); // delete a specific sellersby it's id

// Export
module.exports = router;
