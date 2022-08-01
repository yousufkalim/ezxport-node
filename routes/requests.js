/**
 * request CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const request = require('../controllers/requests');
const { validateRequestBom, validaterRequestVendor, validateDispatch, isValidated } = require('../middleware/validators');

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
// // Read
// router.get('/', request.getAll); // Get all requestat once
// router.get('/:requestId', request.getById); // Get one requestby it's id
// // Update
// router.put('/:requestId', validaterequests, isValidated, request.update); // Update a specific requestby it's id
// // Delete
// router.delete('/:requestId', request.delete); // delete a specific requestby it's id

// Export
module.exports = router;
