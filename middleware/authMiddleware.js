const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && /^Bearer\s/i.test(req.headers.authorization)) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, 'your_jwt_secret'); // In production, use env variable

            // Get account from token
            req.user = await Account.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};


