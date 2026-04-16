const Account = require('../models/Account');
const Transaction = require('../models/Transaction');


//    Deposit funds
//    POST /api/transaction/deposit

exports.deposit = async (req, res) => {
    try {
        const { amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Please provide a valid amount' });
        }

        const account = await Account.findById(req.user._id);

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        // Update balance
        account.balance += Number(amount);
        await account.save();

        // Create transaction record
        await Transaction.create({
            account: req.user._id,
            transactionType: 'deposit',
            amount: Number(amount),
            description: description || 'Self deposit',
            balanceAfterTransaction: account.balance
        });

        res.status(200).json({
            success: true,
            message: 'Funds deposited successfully',
            newBalance: account.balance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Withdraw funds
//  POST /api/transaction/withdraw

exports.withdraw = async (req, res) => {
    try {
        const { amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Please provide a valid amount' });
        }

        const account = await Account.findById(req.user._id);

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        if (account.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        // Update balance
        account.balance -= Number(amount);
        await account.save();

        // Create transaction record
        await Transaction.create({
            account: req.user._id,
            transactionType: 'withdraw',
            amount: Number(amount),
            description: description || 'Self withdrawal',
            balanceAfterTransaction: account.balance
        });

        res.status(200).json({
            success: true,
            message: 'Funds withdrawn successfully',
            newBalance: account.balance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Transfer funds
// POST /api/transaction/transfer

exports.transfer = async (req, res) => {
    try {
        const { targetAccountNumber, amount, description } = req.body;

        if (!targetAccountNumber || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Please provide target account number and a valid amount' });
        }

        const senderAccount = await Account.findById(req.user._id);

        if (!senderAccount) {
            return res.status(404).json({ success: false, message: 'Sender account not found' });
        }

        if (senderAccount.accountNumber === targetAccountNumber) {
            return res.status(400).json({ success: false, message: 'Cannot transfer to the same account' });
        }

        if (senderAccount.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        const receiverAccount = await Account.findOne({ accountNumber: targetAccountNumber });

        if (!receiverAccount) {
            return res.status(404).json({ success: false, message: 'Target account not found' });
        }

        // Update balances
        senderAccount.balance -= Number(amount);
        receiverAccount.balance += Number(amount);

        await senderAccount.save();
        await receiverAccount.save();

        // Create transaction record for sender
        await Transaction.create({
            account: senderAccount._id,
            transactionType: 'transfer',
            amount: Number(amount),
            description: description || `Transfer to ${targetAccountNumber}`,
            balanceAfterTransaction: senderAccount.balance
        });

        // Create transaction record for receiver
        await Transaction.create({
            account: receiverAccount._id,
            transactionType: 'transfer',
            amount: Number(amount),
            description: description || `Transfer from ${senderAccount.accountNumber}`,
            balanceAfterTransaction: receiverAccount.balance
        });

        res.status(200).json({
            success: true,
            message: 'Funds transferred successfully',
            newBalance: senderAccount.balance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get transaction history
// GET /api/transaction/history

exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ account: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


