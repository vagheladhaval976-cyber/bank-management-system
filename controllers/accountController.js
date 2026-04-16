const Account = require('../models/Account');
const sendEmail = require('../utils/sendEmail');


//   Generate 12-digit account number
exports.generateAccountNumber = () => {
    const prefix = "3950";
    const randomPart = Math.floor(10000000 + Math.random() * 90000000).toString();
    return prefix + randomPart;
};

//   Register new account
//   POST /api/account/register
exports.register = async (req, res) => {
    try {
        const {
            accountType,
            firstName,
            middleName,
            lastName,
            dob,
            contactNo,
            email,
            gender,
            address,
            proofType
        } = req.body;

        // Check if user already exists
        const userExists = await Account.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Generate unique account number
        const accountNumber = exports.generateAccountNumber();

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create new account instance
        const account = await Account.create({
            accountType,
            firstName,
            middleName,
            lastName,
            dob,
            contactNo,
            email,
            gender,
            address,
            proofType,
            accountNumber,
            otp,
            otpExpires,
            isVerified: false
        });

        if (account) {
            try {
                const message = `Hello ${firstName},\n\nYour account has been created.\nYour Account Number is: ${accountNumber}\nUse this OTP to verify your email: ${otp}\n\nThis OTP is valid for 10 minutes.`;
                await sendEmail({
                    email: account.email,
                    subject: 'Bank Pro - Verify Your Account',
                    message,
                    otp
                });
            } catch (emailError) {
                console.error("Failed to send OTP email:", emailError);
                // Even if email fails, account is created, they can resend later or admin can check
            }

            res.status(201).json({
                success: true,
                message: 'Account created successfully. Please check your email for the OTP.',
                data: {
                    accountNumber: account.accountNumber,
                    firstName: account.firstName,
                    email: account.email
                }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//   Get current account details
exports.getAccountDetails = async (req, res) => {
    try {
        const account = await Account.findById(req.user._id).select('-password');
        if (account) {
            res.status(200).json({ success: true, data: account });
        } else {
            res.status(404).json({ success: false, message: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//   Update account profile
exports.updateProfile = async (req, res) => {
    try {
        const account = await Account.findById(req.user._id);

        if (account) {
            // Update fields if they are in the request body
            account.firstName = req.body.firstName || account.firstName;
            account.lastName = req.body.lastName || account.lastName;
            account.contactNo = req.body.contactNo || account.contactNo;
            account.address = req.body.address || account.address;

            const updatedAccount = await account.save();

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    _id: updatedAccount._id,
                    accountNumber: updatedAccount.accountNumber,
                    firstName: updatedAccount.firstName,
                    lastName: updatedAccount.lastName,
                    contactNo: updatedAccount.contactNo,
                    address: updatedAccount.address,
                    email: updatedAccount.email
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


