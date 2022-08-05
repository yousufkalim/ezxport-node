/**
 * request CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const request = require('../controllers/requests');
const { upload } = require('../middleware/multer');
const {
  validateRequestBom,
  validaterRequestVendor,
  validateDispatch,
  ValidateDocuments,
  validateUploadDocuments,
  isValidated,
} = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post request create
 * @method get get all request
 * @method get get requestby id
 * @method put update request
 * @method delete delete request
 */

// First Step - Boms
router.post('/boms', validateRequestBom, isValidated, request.boms);
// 2nd Step - userVendor
router.put('/userVendor', validaterRequestVendor, isValidated, request.userVendor);
//  3rd Step - dispatch
router.put('/dispatch', validateDispatch, isValidated, request.Dispatch);
//  4th Step - document
router.put('/documentsUpload/:requestId', upload.single('file'), validateUploadDocuments, isValidated, request.documentsUpload);
router.put('/documents', ValidateDocuments, isValidated, request.Documents);
// // Read
router.get('/', request.getAll); // Get all requests at once
// router.get('/:requestId', request.getById); // Get one requestby it's id
// // Update
// router.put('/:requestId', validaterequests, isValidated, request.update); // Update a specific requestby it's id
// // Delete
// router.delete('/:requestId', request.delete); // delete a specific requestby it's id

// Export
module.exports = router;
