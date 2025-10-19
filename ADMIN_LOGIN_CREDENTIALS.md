# Admin Login Credentials

## Admin Account
- **Admin ID**: `ADM001`
- **Name**: administrator
- **Password**: `admin123`

## How to Login
1. Navigate to: http://localhost:3001/login/admin
2. Click the "Administrator" tab
3. Enter Admin ID: `ADM001`
4. Enter your password
5. Click "Sign In as Admin"

## Admin ID Format
- Admin IDs follow the format: `ADM001`, `ADM002`, `ADM003`, etc.
- **NOT** "admin" or the admin name
- The ID is assigned when the admin account is created

## Test Credentials
```
Admin ID: ADM001
Password: admin123
```

## Troubleshooting
- **Error 401 (Unauthorized)**: Check that you're using the correct Admin ID format (e.g., ADM001) and the correct password
- If you forgot your password, contact the system administrator or reset it in the database
- Make sure you're entering exactly `ADM001` (not "admin" or "administrator")

## Available Admins in Database
Run this command to see all admin accounts:
```bash
cd backend
node -e "const db = require('./models'); db.sequelize.authenticate().then(() => db.Admin.findAll().then(admins => { console.log('Admins:'); admins.forEach(a => console.log('ID:', a.admin_id, 'Name:', a.name)); process.exit(0); }));"
```
