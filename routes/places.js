/**
 * places CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const places = require('../controllers/places');
const { commonAuth } = require('../middleware/commonAuth');
const { userAuth } = require('../middleware/userAuth');
const { validatePlace, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post places create
 * @method get get all places
 * @method get get placesby id
 * @method put update places
 * @method delete delete places
 */

// Create - placesyo
router.post('/', userAuth, validatePlace, isValidated, places.create);
// Read
router.get('/', commonAuth, places.getAll); // Get all place at once
router.put('/getByUser/:userId', commonAuth, places.getByUser); // Get all places of a user
router.get('/:placeId', commonAuth, places.getById); // Get one place sby it's id
// Update
router.put('/:placeId', userAuth, validatePlace, isValidated, places.update); // Update a specific place by it's id
// Delete
router.delete('/:placeId', userAuth, places.delete); // delete a specific place by it's id

// Export
module.exports = router;
