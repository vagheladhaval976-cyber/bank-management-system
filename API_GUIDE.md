# Bank Management System - API Documentation

Is file mein project ki sabhi APIs ki poori jankari hai (Request Body aur Sample Response ke saath).

---

## 1. Account aur Profile (Public & Private)

### Registration (Step 1)
- **Method**: `POST`
- **Route**: `/api/account/register`
- **Body**:
```json
{
  "accountType": "saving",
  "firstName": "John",
  "middleName": "D",
  "lastName": "Doe",
  "dob": "1990-01-01",
  "contactNo": "9876543210",
  "email": "john.doe@example.com",
  "gender": "Male",
  "address": "123 Street, NY",
  "proofType": "aadhar"
}
```

### Check Account (Step 2)
- **Method**: `POST`
- **Route**: `/api/auth/check`
- **Body**: `{ "accountNumber": "3950XXXXXXXX" }`

### Set Password (Step 3)
- **Method**: `POST`
- **Route**: `/api/auth/set-password`
- **Body**:
```json
{
  "accountNumber": "3950XXXXXXXX",
  "password": "secure-password"
}
```

### Login
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Body**: `{ "accountNumber": "3950XXXXXXXX", "password": "secure-password" }`
- **Response**: Returns a **TOKEN**. Use this token in the header as: `Authorization: Bearer <token>`

### Get Profile Details
- **Method**: `GET`
- **Route**: `/api/account/details`
- **Header**: `Authorization: Bearer <token>`

### Update Profile
- **Method**: `PUT`
- **Route**: `/api/account/update`
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "firstName": "NewName", "lastName": "NewLast" }`

### Logout
- **Method**: `POST`
- **Route**: `/api/auth/logout`
- **Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Change Password
- **Method**: `PUT`
- **Route**: `/api/auth/change-password`
- **Body**: 
```json
{
  "accountNumber": "3950XXXXXXXX",
  "oldPassword": "current-password",
  "newPassword": "new-secure-password"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 2. Transactions (Private - Placeholder)
*Note: Inke liye Logic abhi sirf placeholder hai.*

### Deposit
- **Method**: `POST`
- **Route**: `/api/transaction/deposit`
- **Header**: `Authorization: <token>`
- **Body**: `{ "amount": 5000, "description": "Cash deposit" }`
- **Response**: `{ "success": true, "message": "Funds deposited successfully", "newBalance": 5000 }`

### Withdraw
- **Method**: `POST`
- **Route**: `/api/transaction/withdraw`
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "amount": 1000 }`

### Transfer
- **Method**: `POST`
- **Route**: `/api/transaction/transfer`
- **Header**: `Authorization: Bearer <token>`
- **Body**: `{ "targetAccountNumber": "3950XXXXXXXX", "amount": 1500 }`

### Transaction History
- **Method**: `GET`
- **Route**: `/api/transaction/history`
- **Header**: `Authorization: Bearer <token>`

---
