require('dotenv').config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendManagerInvite = async (email, token) => {
    const inviteLink = `https://8081-ecdceceebbabefefcfccffeabf.premiumproject.examly.io/register-manager?token=${token}&email=${email}`;

    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL, // Must match your verified sender
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
        await sgMail.send(msg);
        console.log(`Invite sent to ${email}`);
    } catch (error) {
        console.error('SendGrid Error:', error.response ? error.response.body : error.message);
        throw new Error('Failed to send invitation email');
    }
};

module.exports = sendManagerInvite;
