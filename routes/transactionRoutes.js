const express = require('express');
const router = express.Router();
const {
    deposit,
    withdraw,
    transfer,
    getTransactionHistory
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.get('/history', protect, getTransactionHistory);

module.exports = router;
