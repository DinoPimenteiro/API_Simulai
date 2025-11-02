# API Documentation

## Table of Contents

- [Authentication](#authentication)
- [Admin Routes](#admin-routes)
- [Client Routes](#client-routes)
- [Auth Routes](#auth-routes)

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

## Admin Routes

### Register Admin

```http
POST /admin/register
```

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Responses:**

- `201` - Admin created successfully
- `400` - Invalid input data
- `409` - Email already registered

### Login Admin

```http
POST /admin/login
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**

- `200` - Login successful

  ```json
  {
    "token": "string",
    "refreshToken": "string"
  }
  ```

- `401` - Invalid credentials
- `404` - Admin not found

### Send Invite

```http
POST /admin/invite
```

**Authorization Required:** Yes

**Request Body:**

```json
{
  "email": "string"
}
```

**Responses:**

- `200` - Invite sent successfully
- `400` - Invalid email
- `401` - Unauthorized
- `500` - Server error

## Client Routes

### Register Client

```http
POST /client/register
```

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "inviteToken": "string"
}
```

**Responses:**

- `201` - Client registered successfully
- `400` - Invalid input data
- `401` - Invalid invite token
- `409` - Email already registered

### Login Client

```http
POST /client/login
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**

- `200` - Login successful

  ```json
  {
    "token": "string",
    "refreshToken": "string"
  }
  ```

- `401` - Invalid credentials
- `404` - Client not found

### Update Profile

```http
PUT /client/profile
```

**Authorization Required:** Yes

**Request Body:**

```json
{
  "name": "string",
  "email": "string"
}
```

**Responses:**

- `200` - Profile updated successfully
- `400` - Invalid input data
- `401` - Unauthorized
- `404` - Client not found

## Auth Routes

### Refresh Token

```http
POST /auth/refresh-token
```

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Responses:**

- `200` - New token generated

  ```json
  {
    "token": "string",
    "refreshToken": "string"
  }
  ```

- `401` - Invalid refresh token
- `404` - Refresh token not found

### Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**

```json
{
  "email": "string"
}
```

**Responses:**

- `200` - Password reset email sent
- `404` - User not found
- `500` - Server error

### Reset Password

```http
POST /auth/reset-password
```

**Request Body:**

```json
{
  "token": "string",
  "password": "string"
}
```

**Responses:**

- `200` - Password reset successful
- `400` - Invalid token
- `404` - User not found

## Error Responses

All endpoints may return these error responses:

```json
{
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
