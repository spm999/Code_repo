// utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const emailTemplates = {
  // Notify admins when a developer submits or updates a code file
  adminNotification: (codeFile, developer) => ({
    subject: `Code File Submitted/Updated: "${codeFile.title}"`,
    html: `
      <h2>Code File Submitted</h2>
      <p>Hello Admin,</p>
      <p>The code file "<strong>${codeFile.title}</strong>" has been submitted or updated by ${developer.username} and requires your verification.</p>
      <p><strong>Language:</strong> ${codeFile.language}</p>
      <br/>
      <a href="${process.env.FRONTEND_URL}/admin/review/${codeFile._id}" 
         style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
         Review Code File
      </a>
    `,
  }),


  // utils/emailTemplates.js



  // Notify developer when admin approves the code
  approvedNotification: (codeFile, developer, admin) => ({
    subject: `Your Code File "${codeFile.title}" Has Been Approved`,
    html: `
      <h2>Code Approved 🎉</h2>
      <p>Hello ${developer.username},</p>
      <p>Your code file "<strong>${codeFile.title}</strong>" has been approved by ${admin.username}.</p>
      <p><strong>Status:</strong> Approved</p>
      <br/>
      <a href="${process.env.FRONTEND_URL}/files/${codeFile._id}" 
         style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
         View Code File
      </a>
    `,
  }),

  // Notify developer when admin rejects the code
  rejectedNotification: (codeFile, developer, admin, comments) => ({
    subject: `Your Code File "${codeFile.title}" Has Been Rejected`,
    html: `
      <h2>Code Rejected ❌</h2>
      <p>Hello ${developer.username},</p>
      <p>Your code file "<strong>${codeFile.title}</strong>" has been rejected by ${admin.username}.</p>
      ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
      <p><strong>Status:</strong> Rejected</p>
      <br/>
      <a href="${process.env.FRONTEND_URL}/files/${codeFile._id}" 
         style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
         View Code File
      </a>
    `,
  }),
};

// Generic send email function
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

// Send notification to all admins
const notifyAdmins = async (admins, codeFile, developer) => {
  for (const admin of admins) {
    const email = emailTemplates.adminNotification(codeFile, developer);
    await sendEmail(admin.email, email.subject, email.html);
  }
};

module.exports = { transporter, emailTemplates, sendEmail, notifyAdmins };
