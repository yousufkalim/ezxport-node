/**
 * request CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const request = require('../controllers/requests');
const { upload } = require('../middleware/multer');
const {
  validateRequestBom,
  validateSearchTitle,
  validateCreateTitle,
  validaterRequestVendor,
  validateDispatch,
  ValidateDocuments,
  validateUploadDocuments,
  validateStatusDocument,
  validateMissingDoc,
  isValidated,
  validateCalculationCost,
} = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post request create
 * @method get get all request
 * @method get get requestby id
 * @method put update request
 * @method delete delete request
 */
//Calculate Certification Cost
router.post('/calculateCost', validateCalculationCost, isValidated, request.calculateCost);
// Create Name
router.post('/createName', validateCreateTitle, isValidated, request.createName);
//Search Name
router.post('/searchName', validateSearchTitle, isValidated, request.searchName);
// First Step - Boms
router.post('/boms', validateRequestBom, isValidated, request.boms);
// 2nd Step - userVendor
router.put('/userVendor', validaterRequestVendor, isValidated, request.userVendor);
//  3rd Step - dispatch
router.put('/dispatch', validateDispatch, isValidated, request.Dispatch);
//  4th Step - document
router.put('/documentsUpload/:requestId', upload.single('file'), validateUploadDocuments, isValidated, request.documentsUpload);
router.put('/documents', ValidateDocuments, isValidated, request.Documents);
//Checkout Request --
router.post('/checkout', request.Checkout);
//Send Email
router.put('/sendEmail/:requestId', request.sendEmail);
// // Read
router.get('/', request.getAll); // Get all requests at once
router.get('/:requestId', request.getById); // Get one requestby it's id
router.get('/getByUser/:userId', request.getByuserId); // Get one requestby it's id
router.get('/getByCountry/:countryId', request.getBycountryId); // Get one requestby it's id
//request by admin
router.put('/validateDoc/:requestId', validateStatusDocument, isValidated, request.validateDoc);
router.put('/validateProductDoc/:productId', request.validateProductDoc);
router.put('/ReqmissingDocs/:requestId', validateMissingDoc, isValidated, request.ReqmissingDocs);
router.put('/ProductmissingDocs/:productId', validateMissingDoc, isValidated, request.ProductmissingDocs);
router.put('/validateRequest/:requestId', request.validateRequest);

// Export
module.exports = router;
