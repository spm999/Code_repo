// utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
  port: 587,
  secure: false, // 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const emailTemplates = {
  reviewerAssignment: (file, reviewer, assigner) => ({
    subject: `New Code File Assigned for Review: ${file.title}`,
    html: `
      <h2>Code Review Assignment</h2>
      <p>Hello ${reviewer.username},</p>
      <p>You have been assigned to review a new code file:</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Language:</strong> ${file.language}</p>
      <p><strong>Description:</strong> ${file.description}</p>
      <p><strong>Assigned by:</strong> ${assigner.username}</p>
      <br/>
      <p>Please review the code at your earliest convenience.</p>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}">Review Code File</a>
    `,
  }),

  adminApprovalRequest: (file, admin, requester) => ({
    subject: `Code File Ready for Final Approval: ${file.title}`,
    html: `
      <h2>Admin Approval Required</h2>
      <p>Hello ${admin.username},</p>
      <p>A code file has been reviewed and is ready for your final approval:</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Language:</strong> ${file.language}</p>
      <p><strong>Reviewed by:</strong> ${requester.username}</p>
      <br/>
      <p>Please review and provide final approval.</p>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}">Approve Code File</a>
    `,
  }),

  fileApproved: (file, user, approver) => ({
    subject: `Your Code File Has Been Approved: ${file.title}`,
    html: `
      <h2>Code File Approved</h2>
      <p>Hello ${user.username},</p>
      <p>Your code file has been approved by ${approver.username}:</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Status:</strong> Approved</p>
      <br/>
      <p>You can now share this file with others.</p>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}">View Code File</a>
    `,
  }),

  fileShared: (file, recipient, sharer, permission) => ({
    subject: `${sharer.username} Shared a Code File With You`,
    html: `
      <h2>Code File Shared</h2>
      <p>Hello ${recipient.username},</p>
      <p>${sharer.username} has shared a code file with you (${permission} access):</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Language:</strong> ${file.language}</p>
      <p><strong>Description:</strong> ${file.description}</p>
      <br/>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}">Access Code File</a>
    `,
  }),

  reviewRequest: (file, reviewer, author) => ({
    subject: `Review Request for Code File: ${file.title}`,
    html: `
      <h2>Review Request</h2>
      <p>Hello ${reviewer.username},</p>
      <p>${author.username} has requested your review for a code file:</p>
      <p><strong>Title:</strong> ${file.title}</p>
      <p><strong>Language:</strong> ${file.language}</p>
      <br/>
      <a href="${process.env.FRONTEND_URL}/code/${file._id}/review">Review Code File</a>
    `,
  }),
};


// utils/emailTemplates.js (additional templates for review system)
exports.reviewRequest = (codeFile, reviewer, requester, message) => ({
  subject: `Review Request: "${codeFile.title}"`,
  html: `
    <h2>Code Review Request</h2>
    <p>Hello ${reviewer.username},</p>
    <p>${requester.username} has requested your review for the code file "${codeFile.title}".</p>
    ${message ? `<p><strong>Message from ${requester.username}:</strong> ${message}</p>` : ''}
    <p><strong>File description:</strong> ${codeFile.description || 'No description'}</p>
    <p><strong>Language:</strong> ${codeFile.language}</p>
    <a href="${process.env.FRONTEND_URL}/review/${codeFile._id}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Review File
    </a>
  `
});

exports.versionSubmitted = (codeFile, version, reviewer, submitter) => ({
  subject: `New Version Submitted: "${codeFile.title}"`,
  html: `
    <h2>New Version for Review</h2>
    <p>Hello ${reviewer.username},</p>
    <p>${submitter.username} has submitted a new version of "${codeFile.title}" for your review.</p>
    <p><strong>Version:</strong> ${version.version}</p>
    ${version.changeLog ? `<p><strong>Change Log:</strong> ${version.changeLog}</p>` : ''}
    <a href="${process.env.FRONTEND_URL}/review/${codeFile._id}?version=${version._id}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Review Version
    </a>
  `
});

exports.reviewerApproved = (codeFile, owner, reviewer, comments) => ({
  subject: `Review Complete: "${codeFile.title}"`,
  html: `
    <h2>Review Completed</h2>
    <p>Hello ${owner.username},</p>
    <p>${reviewer.username} has completed the review of your code file "${codeFile.title}".</p>
    <p><strong>Status:</strong> Approved by reviewer</p>
    ${comments ? `<p><strong>Reviewer Comments:</strong> ${comments}</p>` : ''}
    <p>The file has been sent to admin for final approval.</p>
    <a href="${process.env.FRONTEND_URL}/files/${codeFile._id}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      View File
    </a>
  `
});

exports.fileApproved = (codeFile, owner, admin, comments) => ({
  subject: `Approved: "${codeFile.title}"`,
  html: `
    <h2>File Approved 🎉</h2>
    <p>Hello ${owner.username},</p>
    <p>Your code file "${codeFile.title}" has been approved by ${admin.username}.</p>
    ${comments ? `<p><strong>Admin Comments:</strong> ${comments}</p>` : ''}
    <p><strong>Status:</strong> ${codeFile.isPublic ? 'Public' : 'Private'}</p>
    <a href="${process.env.FRONTEND_URL}/files/${codeFile._id}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      View Approved File
    </a>
  `
});

exports.adminApprovalRequest = (codeFile, admin, reviewer) => ({
  subject: `Final Approval Required: "${codeFile.title}"`,
  html: `
    <h2>Final Approval Request</h2>
    <p>Hello ${admin.username},</p>
    <p>${reviewer.username} has approved the code file "${codeFile.title}" and it requires your final approval.</p>
    <p><strong>File:</strong> ${codeFile.title}</p>
    <p><strong>Reviewer:</strong> ${reviewer.username}</p>
    <a href="${process.env.FRONTEND_URL}/admin/review/${codeFile._id}" style="background: #ffc107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Final Approval
    </a>
  `
});

exports.versionReviewed = (codeFile, version, author, reviewer, review) => ({
  subject: `Review Completed: "${codeFile.title}" - ${review.status}`,
  html: `
    <h2>Review Results</h2>
    <p>Hello ${author.username},</p>
    <p>${reviewer.username} has completed the review of your version ${version.version} of "${codeFile.title}".</p>
    <p><strong>Status:</strong> ${review.status}</p>
    <p><strong>Review Type:</strong> ${review.reviewType}</p>
    ${review.rating ? `<p><strong>Rating:</strong> ${review.rating}/5</p>` : ''}
    ${review.comments ? `<p><strong>Comments:</strong> ${review.comments}</p>` : ''}
    ${review.feedback ? `<p><strong>Feedback:</strong> ${review.feedback}</p>` : ''}
    <a href="${process.env.FRONTEND_URL}/files/${codeFile._id}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      View File
    </a>
  `
});

exports.reviewCompleted = (codeFile, reviewer, admin, comments) => ({
  subject: `Final Approval: "${codeFile.title}"`,
  html: `
    <h2>File Finally Approved</h2>
    <p>Hello ${reviewer.username},</p>
    <p>The code file "${codeFile.title}" that you reviewed has been finally approved by ${admin.username}.</p>
    ${comments ? `<p><strong>Admin Comments:</strong> ${comments}</p>` : ''}
    <p>Thank you for your review contribution!</p>
    <a href="${process.env.FRONTEND_URL}/files/${codeFile._id}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      View Approved File
    </a>
  `
});


// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

module.exports = { transporter, emailTemplates, sendEmail };