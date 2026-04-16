const express = require('express');
const router = express.Router();
const {
    register,
    getAccountDetails,
    updateProfile
} = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.get('/details', protect, getAccountDetails);
router.post('/update', protect, updateProfile);

module.exports = router;
