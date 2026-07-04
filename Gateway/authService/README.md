# Auth Service

## Phase 1 Goal

Build a production-ready authentication service with registration, login, JWT issuance, password hashing, validation, and profile retrieval.

## Folder Structure

```text
auth-service/
src/
  app.js
  server.js
  config/
    db.js
    logger.js
  controllers/
    authController.js
  middleware/
    authMiddleware.js
    errorHandler.js
  models/
    User.js
  routes/
    authRoutes.js
  services/
  utils/
    appError.js
  validators/
    authValidator.js
```

## File-by-File Explanation

- src/app.js: Express app setup, middleware, health route, and global error handling.
- src/server.js: Starts the service and connects to MongoDB.
- src/config/db.js: Establishes the MongoDB connection.
- src/config/logger.js: Configures Winston logging to console and file.
- src/controllers/authController.js: Handles registration, login, and profile logic.
- src/middleware/authMiddleware.js: Verifies JWTs and attaches the authenticated user.
- src/middleware/errorHandler.js: Centralized error handling.
- src/models/User.js: Mongoose user schema with bcrypt hashing.
- src/routes/authRoutes.js: Exposes the authentication routes.
- src/validators/authValidator.js: Validates request bodies.
- src/utils/appError.js: Custom error class for consistent API errors.

## Environment Variables

Create a .env file based on .env.example.

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/auth-service
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

## Required npm Packages

```bash
npm install express mongoose dotenv jsonwebtoken bcrypt express-validator helmet morgan winston
```

## Database Schema

User document:

```json
{
  "_id": "ObjectId",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "$2b$12$...hashed",
  "role": "user",
  "createdAt": "2026-07-04T00:00:00.000Z",
  "updatedAt": "2026-07-04T00:00:00.000Z"
}
```

## API Documentation

### POST /api/auth/register

Creates a new user and returns a JWT.

### POST /api/auth/login

Authenticates a user and returns a JWT.

### GET /api/auth/profile

Returns the authenticated user's profile. Requires a Bearer token.

## Example Request

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ada@example.com",
  "password": "password123"
}
```

### Profile

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

## Example Response

### Register

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "user"
  }
}
```

## Curl Commands

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"password123","role":"user"}'

curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"password123"}'

curl http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

## Postman Testing Guide

1. Create a new request collection named Auth Service.
2. Add a POST request to /api/auth/register with JSON body.
3. Add a POST request to /api/auth/login with JSON body.
4. Add a GET request to /api/auth/profile and set the Authorization header to Bearer <token>.
5. Verify 201/200 responses and inspect the returned user data.

## Expected Database Records

After successful registration, MongoDB should contain one document in the users collection.

```json
{
  "_id": "ObjectId",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "user",
  "password": "$2b$12$..."
}
```

## Common Errors

- E11000 duplicate key error: email already exists.
- Missing or invalid JWT: 401 Unauthorized.
- Invalid password or email: 401 Unauthorized.
- Validation errors: 400 Bad Request.

## Debugging Tips

- Ensure MongoDB is running on localhost:27017.
- Confirm the JWT secret is set in the .env file.
- Check logs in logs/app.log.
- Inspect request payloads for validation issues.

## How JWT Works

1. The client sends credentials to /login.
2. The server validates the password.
3. The server signs a JWT with the user's ID and a secret.
4. The client sends that token in the Authorization header.
5. Middleware verifies the token and attaches the user to the request.

## How Middleware Works

The auth middleware runs before the route handler and checks whether the incoming request has a valid token. If it does, the authenticated user is attached to req.user and the request continues.

## How to Verify the Phase Works

1. Start MongoDB.
2. Copy .env.example to .env and adjust values.
3. Run npm install.
4. Run npm start.
5. Call the register and login endpoints.
6. Use the returned token against /profile.

## Git Commit Message

```bash
git add .
git commit -m "feat(auth): build phase 1 authentication service"
```
