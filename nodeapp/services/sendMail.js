require('dotenv').config();
const nodemailer = require('nodemailer');
const SENDER_EMAIL = 'lordhorus02@gmail.com'
    const GMAIL_APP_PASSWORD = 'korm drox wkqm aocr'
// 1. Setup the Transport (The engine)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL, // Your gmail address
        pass: GMAIL_APP_PASSWORD // 16-character App Password
    },
    debug: true, // Show detailed SMTP logs
    logger: true // Log information to console
});

const sendManagerInvite = async (email, token) => {
    const inviteLink = `https://8080-ecdceceebbabefefcfccffeabf.premiumproject.examly.io/register-manager?token=${token}&email=${email}`;
    
    // 2. Define the Message
    const mailOptions = {
        from: `"HR Management" <${SENDER_EMAIL}>`,
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
        // 3. Send the Mail
        const info = await transporter.sendMail(mailOptions);
        console.log(`Invite sent to ${email}. MessageId: ${info.messageId}`);
    } catch (error) {
        console.error('Nodemailer Error:', error.message);
        throw new Error('Failed to send invitation email');
    }
};

module.exports = sendManagerInvite;
