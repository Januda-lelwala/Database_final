# Driver and Assistant Login Credentials

## Existing Employees - Temporary Credentials

All existing employees have been assigned temporary credentials and **MUST change their password on first login**.

### Drivers

| Driver ID | Name | Username | Temporary Password |
|-----------|------|----------|-------------------|
| DRV001 | John Driver | `john` | `Welcome123!` |
| DRV002 | Jane Transport | `jane` | `Welcome123!` |
| DRV003 | Mike Wilson | `mike` | `Welcome123!` |
| DRV004 | Sarah Johnson | `sarah` | `Welcome123!` |
| DRV005 | Dinuka Kavinda | `dinuka` | `Welcome123!` |
| DRV006 | Senuth Abeywardana | `senuth` | `Welcome123!` |
| DRV007 | Isuru Sampath | `isuru` | *(has different password)* |

### Assistants

| Assistant ID | Name | Username | Temporary Password |
|--------------|------|----------|-------------------|
| AST001 | Sarah Support | `sarahs` | `Welcome123!` |
| AST002 | David Logistics | `david` | `Welcome123!` |
| AST003 | Emma Helper | `emma` | `Welcome123!` |
| AST004 | Tom Assistant | `tom` | `Welcome123!` |
| AST005 | Senura Sachintha | `senura` | `Welcome123!` |

## How to Log In

1. **Go to Employee Login**: Navigate to `/employee/login`
2. **Select Your Role**: Click the "Driver" or "Assistant" tab
3. **Enter Credentials**:
   - Username: Your assigned username (e.g., `john`, `jane`)
   - Password: `Welcome123!` (for existing employees)
4. **First Login**: You'll be prompted to change your password
5. **Password Requirements**:
   - Minimum 8 characters
   - Must contain uppercase letter
   - Must contain lowercase letter
   - Must contain number
   - Must contain symbol

## For New Employees

When an admin creates a new driver or assistant:
- Username is automatically generated from first name (e.g., "John Doe" → `john`)
- Secure random password is generated (10 characters)
- Credentials are emailed to the employee
- Admin also sees credentials in success message
- Employee must change password on first login

## Password Change

After first login, employees can change their password at any time through:
- **API Endpoint**: `POST /api/drivers/:id/change-password` or `POST /api/assistants/:id/change-password`
- **Required fields**:
  - `current_password`: Your current password
  - `new_password`: New password (must meet requirements)
  - `new_user_name`: (optional) Change your username

## Testing Login

### Test Driver Login (john)
```bash
POST http://localhost:3000/api/auth/driver/login
Content-Type: application/json

{
  "user_name": "john",
  "password": "Welcome123!"
}
```

### Test Assistant Login (david)
```bash
POST http://localhost:3000/api/auth/assistant/login
Content-Type: application/json

{
  "user_name": "david",
  "password": "Welcome123!"
}
```

## Security Notes

- All passwords are hashed with bcrypt (12 rounds)
- Plain passwords are never stored in the database
- `must_change_password` flag forces password change on first login
- Usernames must be unique across all drivers/assistants
- Failed login attempts return generic "Invalid credentials" message for security

## Admin Credentials (for reference)

| Admin ID | Password |
|----------|----------|
| ADM001 | admin123 |

---

*Last Updated: October 19, 2025*
*For support, contact system administrator*
