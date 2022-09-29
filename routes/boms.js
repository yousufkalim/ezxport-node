/**
 * bom CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const { checkAdminAuth } = require('../middleware/adminAuth');
const { userAuth } = require('../middleware/userAuth');
const { commonAuth } = require('../middleware/commonAuth');
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
router.post('/', checkAdminAuth, validateBoms, isValidated, bom.create);
// Create - bom Signup
router.post('/filterCodes', upload.single('file'), userAuth, validateCountryID, isValidated, bom.filterCode);
// Create - bom Signup
router.post('/uploadCodes', upload.single('file'), checkAdminAuth, validateCountryID, isValidated, bom.uploadCodes);
// Read
router.get('/', commonAuth, bom.getAll); // Get all bomat once
router.get('/getByCountryId/:countryId', commonAuth, bom.getByCountryId); // Get all bomat once
router.get('/:bomId', commonAuth, bom.getById); // Get one bomby it's id
// Update
router.put('/:bomId', checkAdminAuth, validateBoms, isValidated, bom.update); // Update a specific bomby it's id
// Delete
router.delete('/:bomId', checkAdminAuth, bom.delete); // delete a specific bomby it's id

// Export
module.exports = router;
