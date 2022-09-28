/**
 * User CRUD routes
 * @author Yousuf Kalim
 */
const router = require('express').Router();
const users = require('../controllers/users');
const { checkAdminAuth } = require('../middleware/adminAuth');
const { commonAuth } = require('../middleware/commonAuth');
const { userAuth } = require('../middleware/userAuth');
const { validateUser, validateUserUpdate, validateQuestion, isValidated } = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user signup
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

// Create - User Signup
router.post('/', validateUser, isValidated, users.create);

// Create - User Excel  Sheet
router.get('/excelSheet', checkAdminAuth, users.excelSheet);

// Read
router.get('/', checkAdminAuth, users.getAll); // Get all users at once
router.get('/:userId', commonAuth, users.getById); // Get one user by it's id

// Update
router.put('/:userId', userAuth, validateUserUpdate, isValidated, users.update); // Update a specific user by it's id
// Delete
router.delete('/:userId', checkAdminAuth, users.delete); // delete a specific user by it's id

// Ask me a Question
router.post('/sendQuestion/:userId', userAuth, validateQuestion, isValidated, users.sendQuestion);

// Export
module.exports = router;
