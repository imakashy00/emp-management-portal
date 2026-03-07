require('dotenv').config();
const nodemailer = require('nodemailer');
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER, 
        pass: GMAIL_APP_PASSWORD 
    },
    debug: true, 
    logger: true 
});

// EXISTING FUNCTION (Kept exactly as is)
const sendManagerInvite = async (email, token) => {
    const inviteLink = `https://8081-aceeaaadefefcfccffeabf.premiumproject.examly.io/register-manager?token=${token}&email=${email}`;
    
    const mailOptions = {
        from: `"HR Management" <${GMAIL_USER}>`,
        to: email,
        subject: 'Manager Registration Invitation',
        html: `
        <h3>HR Management System - Invitation</h3>
        <p>A manager has invited you to join the team with administrative privileges.</p>
        <a href="${inviteLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Accept Invitation & Register
        </a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Invite sent to ${email}. MessageId: ${info.messageId}`);
    } catch (error) {
        console.error('Nodemailer Error:', error.message);
        throw new Error('Failed to send invitation email');
    }
};

// NEW FUNCTION: For Password Reset OTP
const sendPasswordResetOTP = async (email, otp) => {
    console.log("emk")
    const mailOptions = {
        from: `"HR Management" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Password Reset Code',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #1C4587; text-align: center;">WorkBuddy Password Recovery</h2>
            <p>Hello,</p>
            <p>You requested a password reset. Please use the 6-digit verification code below to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3C78D8; background: #f4f7f6; padding: 10px 20px; border-radius: 5px; border: 1px dashed #3C78D8;">
                    ${otp}
                </span>
            </div>
            <p style="color: #666; font-size: 12px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}. MessageId: ${info.messageId}`);
    } catch (error) {
        console.error('Nodemailer Error (OTP):', error.message);
        throw new Error('Failed to send OTP email');
    }
};

// Export both functions so they can be used individually
module.exports = {
    sendManagerInvite,
    sendPasswordResetOTP
};