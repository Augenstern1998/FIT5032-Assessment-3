import * as nodemailer from 'nodemailer';

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachment?: {
    filename: string;
    content: string;
    contentType: string;
  };
  subscribeNewsletter?: boolean;
}

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send contact email
 */
export async function sendContactEmail(data: ContactEmailData): Promise<EmailResult> {
  try {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: `[Website Contact Form] ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #666;">Contact Information</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Newsletter Subscription:</strong> ${data.subscribeNewsletter ? 'Yes' : 'No'}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #666;">Message Content</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              Submission Time: ${new Date().toLocaleString('en-US')}<br>
              Source Page: FIT5032 Assessment 3 - Contact Form
            </p>
          </div>
        </div>
      `,
      attachments: data.attachment ? [{
        filename: data.attachment.filename,
        content: data.attachment.content,
        contentType: data.attachment.contentType
      }] : []
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Contact email sent successfully:', info.messageId);
    
    return {
      success: true,
      id: info.messageId
    };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(userEmail: string, resetLink: string): Promise<EmailResult> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Password Reset Request - FIT5032 Assessment 3',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          
          <p>Hello,</p>
          <p>We received your password reset request. Please click the link below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              This link will expire in 24 hours.<br>
              If you did not request a password reset, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      id: info.messageId
    };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<EmailResult> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to FIT5032 Assessment 3!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome, ${userName}!</h2>
          
          <p>Thank you for registering with our application! We are excited to have you join our community.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #666;">You can:</h3>
            <ul>
              <li>Browse rich learning resources</li>
              <li>Use interactive data tables</li>
              <li>View map features</li>
              <li>Contact our support team</li>
            </ul>
          </div>
          
          <p>If you have any questions, please feel free to contact us.</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              This is an automated email, please do not reply.<br>
              FIT5032 Assessment 3 Team
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      id: info.messageId
    };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
