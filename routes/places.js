/**
 * places CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const places = require('../controllers/places');
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
router.post('/', validatePlace, isValidated, places.create);
// Read
router.get('/', places.getAll); // Get all place at once
router.put('/getByUser/:userId', places.getByUser); // Get all places of a user
router.get('/:placeId', places.getById); // Get one place sby it's id
// Update
router.put('/:placeId', validatePlace, isValidated, places.update); // Update a specific place by it's id
// Delete
router.delete('/:placeId', places.delete); // delete a specific place by it's id

// Export
module.exports = router;
