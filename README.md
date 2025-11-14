# Documentação da API

## Separação das Rotas

- [Authentication](#authentication)
- [Rotas de Admin](#rotas-de-admin)
- [Rotas de Cliente](#rotas-de-cliente)
- [Auth Routes](#auth-routes)

## Authentication

Muitos endpoints (rotas) precisam de autenticação. No cabeçalho da requisição é necessário passar um token JWT neste formato:

```http
Authorization: Bearer <token>
```

## Indicador de Sucesso

Todos os endpoints retornam um resultado boolean guardado no espaço success. Sempre que for bem sucedido `success = true` se não `success = false`

## Rotas de Admin

### Register Admin

```http
POST /admin/register
```

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "age": "integer",
  "password": "string"
}
```

**Responses:**

- `201` - Admin created successfully

```json
{
  "success": true,
  "data": {
    "newAdmin": {
      "id": "hexadecimal",
      "name": "string",
      "email": "string",
      "age": "integer",
      "role": "string"
    }
  }
}
```

- `500` - Internal error

### Get All Comments

```http
GET /admin/comment
```

**Authorization Required:** Yes

```json
{
  "_id": "hexadecimal",
  "name": "string",
  "email": "string",
  "comments": [
    {
      "type": "string/Feedback || Evaluation",
      "text": "string",
      "date": "date"
    },
    {
      "type": "string/Feedback || Evaluation",
      "text": "string",
      "date": "date"
    }
  ]
}
```

**Responses:**

- `200` - Login successful

### Login Admin

```http
POST /admin/login/:id
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
    "acessToken": "string/JWT token",
    "rawToken": "string",
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

## Rotas de Cliente

### Register Client

```http
POST /user
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
PUT /refresh
```

**Responses:**

- `200` - New token generated

  ```json
  {
    "token": "string",
    "refreshToken": {
      "updatedToken": "Object",
      "acessToken": "string/JWT Token",
      "rawToken": "refreshToken"
    }
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
