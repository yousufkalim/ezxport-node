/**
 * document CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const document = require('../controllers/documents');
const { validateDocument, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post document create
 * @method get get all document
 * @method get get documentby id
 * @method put update document
 * @method delete delete document
 */

// Create - document
router.post('/', validateDocument, isValidated, document.create);
// Read
router.get('/', document.getAll); // Get all documentat once
router.get('/getByCountry/:countryId', document.getByCountry); // Get all documentat once
router.get('/:documentId', document.getById); // Get one documentby it's id
// Update
router.put('/:documentId', validateDocument, isValidated, document.update); // Update a specific documentby it's id
// Delete
router.delete('/:documentId', document.delete); // delete a specific documentby it's id

// Export
module.exports = router;
