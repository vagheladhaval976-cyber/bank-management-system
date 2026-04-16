const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    transactionType: {
        type: String,
        enum: ['deposit', 'withdraw', 'transfer'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: 'Self deposit'
    },
    balanceAfterTransaction: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);
