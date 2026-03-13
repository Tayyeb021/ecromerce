const nodemailer = require('nodemailer');
const template = require('../config/template');
const keys = require('../config/keys');

// Create Gmail transporter
const createTransporter = () => {
  try {
    const { email, password } = keys.gmail;
    
    if (!email || !password) {
      console.warn('Missing Gmail credentials');
      return null;
    }

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
  } catch (error) {
    console.error('Error creating Gmail transporter:', error);
    return null;
  }
};

const transporter = createTransporter();

exports.sendEmail = async (toEmail, type, host, data) => {
  try {
    if (!transporter) {
      console.error('Gmail transporter not initialized');
      return { error: 'Email service not configured' };
    }

    const message = prepareTemplate(type, host, data);

    const mailOptions = {
      from: `A-Z On-Buz <${keys.gmail.email}>`,
      to: toEmail,
      subject: message.subject,
      text: message.text,
      html: message.html || message.text // Support HTML emails
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    const msg = error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED'
      ? 'Email service connection failed (check GMAIL_EMAIL, GMAIL_PASSWORD and network).'
      : error.message;
    console.warn('Email send failed:', msg);
    return { error: msg };
  }
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'reset':
      message = template.resetEmail(host, data);
      break;

    case 'reset-confirmation':
      message = template.confirmResetPasswordEmail();
      break;

    case 'signup':
      message = template.signupEmail(data);
      break;

    case 'merchant-signup':
      message = template.merchantSignup(host, data);
      break;

    case 'merchant-welcome':
      message = template.merchantWelcome(data);
      break;

    case 'newsletter-subscription':
      message = template.newsletterSubscriptionEmail();
      break;

    case 'contact':
      message = template.contactEmail();
      break;

    case 'merchant-application':
      message = template.merchantApplicationEmail();
      break;

    case 'merchant-deactivate-account':
      message = template.merchantDeactivateAccount();
      break;

    case 'order-confirmation':
      message = template.orderConfirmationEmail(data);
      break;

    default:
      message = { subject: '', text: '' };
  }

  return message;
};
