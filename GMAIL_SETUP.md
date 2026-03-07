# Gmail Email Setup

## Configuration

The application is now configured to send emails using Gmail (azonbuz48@gmail.com).

## Environment Variables

Add these to your `server/.env` file:

```env
GMAIL_EMAIL=azonbuz48@gmail.com
GMAIL_PASSWORD=mybusiness@97
```

## Important Notes

### If emails don't send:

1. **Enable "Less Secure App Access"** (if available):
   - Go to: https://myaccount.google.com/lesssecureapps
   - Turn ON "Allow less secure apps"
   - Note: This option may not be available for all accounts

2. **Use App Password** (Recommended):
   - Go to: https://myaccount.google.com/apppasswords
   - Generate an App Password for "Mail"
   - Replace `GMAIL_PASSWORD` in `.env` with the generated App Password (16 characters, no spaces)

3. **Enable 2-Step Verification** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Then generate an App Password as described above

## Testing

When a customer places an order, they will automatically receive an order confirmation email with:
- Order ID
- Order Date
- Order Total
- List of items ordered
- Professional HTML email format

## Installation

Make sure to install nodemailer:
```bash
cd server
npm install
```

This will install nodemailer along with other dependencies.
