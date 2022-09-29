/**
 * request CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const request = require('../controllers/requests');
const { checkAdminAuth } = require('../middleware/adminAuth');
const { userAuth } = require('../middleware/userAuth');
const { commonAuth } = require('../middleware/commonAuth');
const { upload } = require('../middleware/multer');
const express = require('express');
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
router.post('/calculateCost', userAuth, validateCalculationCost, isValidated, request.calculateCost);
// Create Name
router.post('/createName', userAuth, validateCreateTitle, isValidated, request.createName);
//Search Name
router.post('/searchName', userAuth, validateSearchTitle, isValidated, request.searchName);
// First Step - Boms
router.post('/boms', userAuth, validateRequestBom, isValidated, request.boms);
// 2nd Step - userVendor
router.put('/userVendor', userAuth, validaterRequestVendor, isValidated, request.userVendor);
//  3rd Step - dispatch
router.put('/dispatch', userAuth, validateDispatch, isValidated, request.Dispatch);
//  4th Step - document
router.put(
  '/documentsUpload/:requestId',
  userAuth,
  upload.single('file'),
  validateUploadDocuments,
  isValidated,
  request.documentsUpload
);
router.put('/documents', userAuth, ValidateDocuments, isValidated, request.Documents);
//Checkout Request --
router.post('/checkout', request.Checkout);
// post - webhook
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), request.Webhook);
//Send Email
router.put('/sendEmail/:requestId', userAuth, request.sendEmail);
//Upload Multiple Missing docs
//UploadmissingDocs
router.put('/UploadmissingDocs/:requestId', userAuth, request.UploadmissingDocs);
// // Read
router.get('/', commonAuth, request.getAll); // Get all requests at once
router.get('/returnMultipleFormatedRequest/:userId', commonAuth, request.returnMultipleFormatedRequest); // Get all requests at once
router.get('/returnFormatedRequest/:requestId', commonAuth, request.returnFormatedRequest); // Get all requests at once
router.get('/getByUser/:userId', commonAuth, request.getByuserId); // Get one requestby it's id
router.get('/getByCountry/:countryId', commonAuth, request.getBycountryId); // Get one requestby it's id
router.get('/zipFile/:requestId', request.zipFile); // Get all requests at once
router.get('/zipFileProduct/:productId', request.zipFileProduct); // Get all requests at once
router.get('/zipFileDocument/:requestId/:doc_id', request.zipFileDocument); // Get all requests at once
router.get('/zipFileCode/:requestId/:code_id', request.zipFileCode); // Get all requests at once
router.get('/:requestId', commonAuth, request.getById); // Get one requestby it's id
//request by admin
router.put('/validateDoc/:requestId', checkAdminAuth, validateStatusDocument, isValidated, request.validateDoc);
router.put('/validateProductDoc/:productId', checkAdminAuth, request.validateProductDoc);
router.put('/ReqmissingDocs/:requestId', checkAdminAuth, request.ReqmissingDocs);
router.put('/ProductmissingDocs/:productId', checkAdminAuth, validateMissingDoc, isValidated, request.ProductmissingDocs);
router.put('/validateRequest/:requestId', checkAdminAuth, request.validateRequest);
router.put('/ProductdocumentsUpload/:productId', upload.single('file'), checkAdminAuth, request.ProductdocumentsUpload);
// Export
module.exports = router;
