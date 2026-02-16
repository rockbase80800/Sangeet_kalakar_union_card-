# API Specification

Base URL: `/api`
Content-Type: `application/json` (except multipart uploads)

## Authentication
- JWT Bearer token for authenticated users.
- Admin endpoints require role `admin`.

## Common Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Card title is required",
    "details": {
      "field": "cardTitle"
    }
  }
}
```

## 1) POST `/api/auth/signup`
Registers a user (optional flow).

### Request
```json
{
  "fullName": "Aarti Sharma",
  "email": "aarti@example.com",
  "password": "StrongPassword#123",
  "mobile": "9876543210"
}
```

### Success (201)
```json
{
  "success": true,
  "data": {
    "userId": "usr_123",
    "token": "jwt_token",
    "role": "user"
  }
}
```

### Errors
- 400 validation error
- 409 email already exists

---

## 2) POST `/api/card/create`
Creates/updates a card order before payment.

### Request (multipart/form-data)
Fields:
- `fullName` (string, required)
- `cardTitle` (string, required)
- `message` (string, optional)
- `designation` (string, optional)
- `artistWork` (string, optional)
- `mobileNo` (string, required)
- `addressLine1` (string, required)
- `addressLine2` (string, optional)
- `imageFile` (file: jpg/png, required)
- `isGuest` (boolean)

### Success (201)
```json
{
  "success": true,
  "data": {
    "orderId": "ord_456",
    "status": "draft",
    "previewUrl": "https://cdn.example.com/previews/ord_456.png"
  }
}
```

### Errors
- 400 missing fields
- 415 unsupported media type
- 401 unauthorized (if auth-required mode)

---

## 3) POST `/api/payment/submit`
Uploads payment proof and marks order for approval review.

### Request (multipart/form-data)
Fields:
- `orderId` (string, required)
- `amount` (number, required, must be 365)
- `paymentProofFile` (image/pdf, required)
- `upiTxnRef` (string, optional)

### Success (200)
```json
{
  "success": true,
  "data": {
    "orderId": "ord_456",
    "status": "pending_approval",
    "message": "Payment received and queued for admin verification."
  }
}
```

### Errors
- 400 invalid amount or missing proof
- 404 order not found
- 409 payment already submitted

---

## 4) GET `/api/admin/orders`
Fetches orders for admin queue.

### Query Params
- `status` = `pending_approval|approved|rejected`
- `page` (default 1)
- `limit` (default 20)

### Success (200)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "orderId": "ord_456",
        "user": {
          "fullName": "Aarti Sharma",
          "email": "aarti@example.com"
        },
        "status": "pending_approval",
        "paymentProofUrl": "https://cdn.example.com/proofs/ord_456.pdf",
        "createdAt": "2026-01-12T09:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1
    }
  }
}
```

### Errors
- 401 unauthorized
- 403 forbidden (non-admin)

---

## 5) PUT `/api/admin/orders/{id}/approve`
Approves order, generates card image + PDF, triggers notifications.

### Request
```json
{
  "approverNote": "Payment verified successfully"
}
```

### Success (200)
```json
{
  "success": true,
  "data": {
    "orderId": "ord_456",
    "status": "approved",
    "downloads": {
      "imageUrl": "https://cdn.example.com/final/ord_456.png",
      "pdfUrl": "https://cdn.example.com/final/ord_456.pdf"
    }
  }
}
```

### Errors
- 404 order not found
- 409 invalid status transition

---

## 6) PUT `/api/admin/orders/{id}/reject`
Rejects payment/order and notifies user with retry guidance.

### Request
```json
{
  "reason": "Uploaded screenshot is unclear. Please upload a clear proof for ₹365."
}
```

### Success (200)
```json
{
  "success": true,
  "data": {
    "orderId": "ord_456",
    "status": "rejected"
  }
}
```

---

## 7) GET `/api/card/{userId}/download`
Returns approved card assets for a user.

### Success (200)
```json
{
  "success": true,
  "data": {
    "orderId": "ord_456",
    "status": "approved",
    "files": {
      "imageUrl": "https://cdn.example.com/final/ord_456.png",
      "pdfUrl": "https://cdn.example.com/final/ord_456.pdf"
    },
    "share": {
      "whatsappUrl": "https://wa.me/?text=...",
      "emailShareUrl": "mailto:?subject=My Card&body=...",
      "publicLink": "https://app.example.com/share/ord_456"
    }
  }
}
```

### Errors
- 401 unauthorized
- 403 access denied
- 404 approved files unavailable

---

## Auth Middleware Rules
- Protect `/api/admin/*` with admin role.
- Ensure users can only access their own orders/downloads.
- Guests must use signed token tied to `orderReference`.
- Validate JWT signature and expiry for each request.
