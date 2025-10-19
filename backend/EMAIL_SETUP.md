# KandyPack Email Setup

To enable email notifications (e.g., when creating drivers or assistants), configure SMTP settings in your backend `.env` file. Example for Gmail and generic SMTP below.

## Required .env keys

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASS=your_gmail_app_password
FROM_EMAIL=your_gmail_address@gmail.com
FROM_NAME=KandyPack Notifications
```

- `SMTP_HOST`: Your SMTP server hostname (e.g., smtp.gmail.com, smtp.office365.com, smtp.mailgun.org)
- `SMTP_PORT`: 465 for SSL, 587 for TLS, 25 for plain (use 465 for Gmail)
- `SMTP_SECURE`: true for SSL (465), false for TLS (587)
- `SMTP_USER`: Your SMTP login (full email address for Gmail)
- `SMTP_PASS`: Your SMTP password (for Gmail, use an App Password, not your main password)
- `FROM_EMAIL`: The sender address shown in emails
- `FROM_NAME`: The sender name shown in emails

## Gmail App Password Setup
1. Enable 2-Step Verification on your Google account.
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail" and "Other" (give it a name like "KandyPack").
4. Use the generated password as `SMTP_PASS` above.

## Example for Mailgun
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your_mailgun_password
FROM_EMAIL=notifications@yourdomain.com
FROM_NAME=KandyPack Notifications
```

## Troubleshooting
- If you see `Email: skipped (SMTP not configured)` in the UI, check your .env and restart the backend.
- All email errors are logged in the backend console.
- You can test email sending by creating a driver/assistant with a real email address.

---
For more help, see https://nodemailer.com/smtp/ or contact your mail provider.