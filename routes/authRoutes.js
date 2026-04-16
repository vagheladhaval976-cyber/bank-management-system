const express = require('express');
const router = express.Router();
const {
    checkAccountExists,
    setPassword,
    login,
    changePassword,
    logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/check', checkAccountExists);
router.post('/set-password', setPassword);
router.post('/login', login);
router.post('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;
