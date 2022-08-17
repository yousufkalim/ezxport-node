/**
 * bom CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const bom = require('../controllers/boms');
const { validateBoms, validateCountryID, isValidated } = require('../middleware/validators');
const { upload } = require('../middleware/multer');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post bomcreate
 * @method get get all bom
 * @method get get bomby id
 * @method put update bom
 * @method delete delete bom
 */

// Create - bom Signup
router.post('/', validateBoms, isValidated, bom.create);
// Create - bom Signup
router.post('/filterCodes', upload.single('file'), validateCountryID, isValidated, bom.filterCode);
// Read
router.get('/', bom.getAll); // Get all bomat once
router.get('/getByCountryId/:countryId', bom.getByCountryId); // Get all bomat once
router.get('/:bomId', bom.getById); // Get one bomby it's id
// Update
router.put('/:bomId', validateBoms, isValidated, bom.update); // Update a specific bomby it's id
// Delete
router.delete('/:bomId', bom.delete); // delete a specific bomby it's id

// Export
module.exports = router;
