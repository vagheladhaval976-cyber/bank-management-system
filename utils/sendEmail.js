const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vagheladhaval976@gmail.com',
            pass: 'eacs qqdv pgbe zqcd'
        }
    });

    const mailOptions = {
        from: 'vagheladhaval976@gmail.com',
        to: options.email || "dkvaghela1204@gmail.com",
        subject: options.subject || 'Bank Pro Registration',
        text: options.message || "your account has been created successfully"
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.log(' Error sending email:', error.message);
    }

    // await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
