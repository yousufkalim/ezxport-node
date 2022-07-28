/**
 * Addressbook CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const addressbook = require('../controllers/addressBooks');
const { validateAddressbook, validateFilterAddressbook, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post addressbookcreate
 * @method get get all addressbook
 * @method get get addressbookby id
 * @method put update addressbook
 * @method delete delete addressbook
 */

// Create - addressbookSignup
router.post('/', validateAddressbook, isValidated, addressbook.create);
router.post('/getByRole', validateFilterAddressbook, isValidated, addressbook.getByRole);
// Read
router.get('/', addressbook.getAll); // Get all addressbookat once
router.get('/:addressbookId', addressbook.getById); // Get one addressbookby it's id
// Update
router.put('/:addressbookId', validateAddressbook, isValidated, addressbook.update); // Update a specific addressbookby it's id
// Delete
router.delete('/:addressbookId', addressbook.delete); // delete a specific addressbookby it's id

// Export
module.exports = router;
