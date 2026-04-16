const Account = require('../models/Account');
const jwt = require('jsonwebtoken');

// Generate JWT
exports.generateToken = (id) => {
    return jwt.sign({ id }, 'your_jwt_secret', { expiresIn: '30d' });
};

//   Check if account exists (Auth flow step 1)
exports.checkAccountExists = async (req, res) => {
    try {
        const { accountNumber } = req.body;
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Account exists',
            isPasswordSet: account.isPasswordSet
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//   Set Password (Auth flow step 2)
exports.setPassword = async (req, res) => {
    try {
        const { accountNumber, password } = req.body;
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        if (account.isPasswordSet) {
            return res.status(400).json({ success: false, message: 'Password already set' });
        }

        account.password = password;
        account.isPasswordSet = true;
        await account.save();

        res.status(200).json({ success: true, message: 'Password set successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//   Login (Auth flow step 3)
exports.login = async (req, res) => {
    try {
        const { accountNumber, password } = req.body;
        const account = await Account.findOne({ accountNumber });

        if (account && (await account.matchPassword(password))) {
            res.status(200).json({
                success: true,
                _id: account._id,
                accountNumber: account.accountNumber,
                token: exports.generateToken(account._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid account number or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//   Change Password
exports.changePassword = async (req, res) => {
    try {
        const { accountNumber, oldPassword, newPassword } = req.body;
        const account = await Account.findOne({ accountNumber });

        if (account && (await account.matchPassword(oldPassword))) {
            account.password = newPassword;
            await account.save();
            res.status(200).json({ success: true, message: 'Password changed successfully' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid account number or old password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//   Logout
exports.logout = async (req, res) => {
    res.status(200).json({ success: true, message: 'Logout successful' });
};


