/**
 * document CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const document = require('../controllers/documents');
const { commonAuth } = require('../middleware/commonAuth');
const { checkAdminAuth } = require('../middleware/adminAuth');
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
router.post('/', checkAdminAuth, validateDocument, isValidated, document.create);
// Read
router.get('/', commonAuth, document.getAll); // Get all documentat once
router.get('/getByCountry/:countryId', commonAuth, document.getByCountry); // Get all documentat once
router.get('/:documentId', commonAuth, document.getById); // Get one documentby it's id
// Update
router.put('/:documentId', checkAdminAuth, validateDocument, isValidated, document.update); // Update a specific documentby it's id
// Delete
router.delete('/:documentId', checkAdminAuth, document.delete); // delete a specific documentby it's id

// Export
module.exports = router;
