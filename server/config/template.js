exports.resetEmail = (host, resetToken) => {
  const message = {
    subject: 'Reset Password',
    text:
      `${
        'You are receiving this because you have requested to reset your password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://'
      }${host}/reset-password/${resetToken}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  return message;
};

exports.confirmResetPasswordEmail = () => {
  const message = {
    subject: 'Password Changed',
    text:
      `You are receiving this email because you changed your password. \n\n` +
      `If you did not request this change, please contact us immediately.`
  };

  return message;
};

exports.merchantSignup = (host, { resetToken, email }) => {
  const message = {
    subject: 'Merchant Registration',
    text: `${
      'Congratulations! Your application has been accepted. Please complete your Merchant account signup by clicking on the link below. \n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://'
    }${host}/merchant-signup/${resetToken}?email=${email}\n\n`
  };

  return message;
};

exports.merchantWelcome = name => {
  const message = {
    subject: 'Merchant Registration',
    text:
      `Hi ${name}! Congratulations! Your application for merchant account has been accepted. \n\n` +
      `It looks like you already have a member account with us. Please sign in with your member credentials and you will be able to see your merchant account.`
  };

  return message;
};

exports.signupEmail = name => {
  const message = {
    subject: 'Account Registration',
    text: `Hi ${name.firstName} ${name.lastName}! Thank you for creating an account with us!.`
  };

  return message;
};

exports.newsletterSubscriptionEmail = () => {
  const message = {
    subject: 'Newsletter Subscription',
    text:
      `You are receiving this email because you subscribed to our newsletter. \n\n` +
      `If you did not request this change, please contact us immediately.`
  };

  return message;
};

exports.contactEmail = () => {
  const message = {
    subject: 'Contact Us',
    text: `We received your message! Our team will contact you soon. \n\n`
  };

  return message;
};

exports.merchantApplicationEmail = () => {
  const message = {
    subject: 'Sell on A-Z On-Buz',
    text: `We received your request! Our team will contact you soon. \n\n`
  };

  return message;
};

exports.merchantDeactivateAccount = () => {
  const message = {
    subject: 'Merchant account on A-Z On-Buz',
    text:
      `Your merchant account has been disabled. \n\n` +
      `Please contact admin to request access again.`
  };

  return message;
};

exports.orderConfirmationEmail = order => {
  const userName = order.user?.profile?.firstName || order.user?.firstName || 'Customer';
  const orderId = order._id || order._id?.toString() || 'N/A';
  const orderDate = order.created ? new Date(order.created).toLocaleDateString() : new Date().toLocaleDateString();
  const orderTotal = order.total || order.totalWithTax || 0;
  
  // Build products list
  let productsList = '';
  if (order.products && order.products.length > 0) {
    productsList = order.products.map((item, index) => {
      const productName = item.product?.name || item.name || 'Product';
      const quantity = item.quantity || 1;
      const price = item.purchasePrice || item.price || 0;
      const itemTotal = price * quantity;
      return `${index + 1}. ${productName} - Quantity: ${quantity} - Price: PKR ${price.toFixed(2)} - Total: PKR ${itemTotal.toFixed(2)}`;
    }).join('\n');
  }

  const text = `Hi ${userName}!

Thank you for your order with A-Z On-Buz!

ORDER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: ${orderId}
Order Date: ${orderDate}
Order Total: PKR ${orderTotal.toFixed(2)}

ITEMS ORDERED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${productsList || 'No items listed'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We've received your order and will process it shortly. You will receive another email once your package has been shipped.

If you have any questions about your order, please contact us at azonbuz48@gmail.com

Thank you for shopping with A-Z On-Buz!

Best regards,
A-Z On-Buz Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2962ff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .order-details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2962ff; }
    .products-list { background-color: white; padding: 15px; margin: 15px 0; }
    .product-item { padding: 8px 0; border-bottom: 1px solid #eee; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .total { font-size: 18px; font-weight: bold; color: #2962ff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
    </div>
    <div class="content">
      <p>Hi ${userName}!</p>
      <p>Thank you for your order with <strong>A-Z On-Buz</strong>!</p>
      
      <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Order Date:</strong> ${orderDate}</p>
        <p class="total"><strong>Order Total:</strong> PKR ${orderTotal.toFixed(2)}</p>
      </div>

      <div class="products-list">
        <h3>Items Ordered</h3>
        ${order.products && order.products.length > 0 ? order.products.map((item, index) => {
          const productName = item.product?.name || item.name || 'Product';
          const quantity = item.quantity || 1;
          const price = item.purchasePrice || item.price || 0;
          const itemTotal = price * quantity;
          return `<div class="product-item">
            <strong>${index + 1}. ${productName}</strong><br>
            Quantity: ${quantity} | Price: PKR ${price.toFixed(2)} | Total: PKR ${itemTotal.toFixed(2)}
          </div>`;
        }).join('') : '<p>No items listed</p>'}
      </div>

      <p>We've received your order and will process it shortly. You will receive another email once your package has been shipped.</p>
      
      <p>If you have any questions about your order, please contact us at <a href="mailto:azonbuz48@gmail.com">azonbuz48@gmail.com</a></p>
      
      <p>Thank you for shopping with A-Z On-Buz!</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>A-Z On-Buz Team</p>
    </div>
  </div>
</body>
</html>`;

  const message = {
    subject: `Order Confirmation - Order #${orderId}`,
    text: text,
    html: html
  };

  return message;
};
