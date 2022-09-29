/**
 * sellers CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const sellers = require('../controllers/sellers');
const { commonAuth } = require('../middleware/commonAuth');
const { userAuth } = require('../middleware/userAuth');
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
router.post('/', userAuth, validateBuyer, isValidated, sellers.create);
//getByUserandCountry
router.post('/getByUserandCountry', commonAuth, validateCountryUser, isValidated, sellers.getByUserandCountry);
// Read
router.get('/', commonAuth, sellers.getAll); // Get all sellersat once
router.get('/getByUser/:userId', commonAuth, sellers.getByUser); // Get all sellers of a user
router.get('/:sellerId', commonAuth, sellers.getById); // Get one sellersby it's id
// Update
router.put('/:sellerId', userAuth, validateBuyer, isValidated, sellers.update); // Update a specific sellersby it's id
// Delete
router.delete('/:sellerId', userAuth, sellers.delete); // delete a specific sellersby it's id

// Export
module.exports = router;
