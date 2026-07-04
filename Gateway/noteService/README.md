# Note Service

## Phase 2 Goal

Build a Notes microservice that provides JWT-protected CRUD operations. Each note belongs to a user; users can only access their own notes.

## Folder Structure

```text
note-service/
src/
  app.js
  server.js
  config/
    db.js
    logger.js
  controllers/
    noteController.js
  middleware/
    authMiddleware.js
    errorHandler.js
  models/
    Note.js
    User.js
  routes/
    noteRoutes.js
  utils/
    appError.js
  validators/
    noteValidator.js
```

## File-by-file Explanation

- `src/app.js`: Express app and middleware wiring, health route, global error handling, and route mounting.
- `src/server.js`: Connects to MongoDB and starts the server.
- `src/config/db.js`: MongoDB connection logic.
- `src/config/logger.js`: Winston logger configuration.
- `src/models/Note.js`: Mongoose schema for notes.
- `src/models/User.js`: Minimal User schema used for auth lookups.
- `src/controllers/noteController.js`: CRUD logic for notes.
- `src/routes/noteRoutes.js`: Route definitions and protection.
- `src/middleware/authMiddleware.js`: JWT verification and `req.user` injection.
- `src/middleware/errorHandler.js`: Centralized error responses.
- `src/validators/noteValidator.js`: Validation rules for create/update.
- `src/utils/appError.js`: Standard error class.

## Environment Variables

Copy `.env.example` and adjust values:

```env
PORT=5002
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/note-service
JWT_SECRET=change_this_to_a_long_random_secret
LOG_LEVEL=info
```

If you changed MongoDB URI in the auth service, make sure to update `MONGO_URI` here to point to the same user collection if you want shared users.

## Required npm Packages

```bash
npm install express mongoose dotenv jsonwebtoken bcrypt express-validator helmet morgan winston
```

## Database Schema

`notes` collection document example:

```json
{
  "_id": "ObjectId",
  "title": "Shopping",
  "content": "Buy milk and eggs",
  "user": "ObjectId(user)",
  "tags": ["personal", "shopping"],
  "createdAt": "2026-07-04T00:00:00.000Z",
  "updatedAt": "2026-07-04T00:00:00.000Z"
}
```

User document (must exist in `users` collection for JWT-protected access):

```json
{
  "_id": "ObjectId",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "$2b$12$...hashed",
  "role": "user"
}
```

## API Documentation

All endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

- POST `/api/notes` — Create a note.
- GET `/api/notes` — List notes for authenticated user.
- GET `/api/notes/:id` — Get a single note (must belong to user).
- PATCH `/api/notes/:id` — Update a note (must belong to user).
- DELETE `/api/notes/:id` — Delete a note (must belong to user).

### POST /api/notes

Request body:

```json
{
  "title": "Title",
  "content": "Some content",
  "tags": ["tag1", "tag2"]
}
```

Response 201:

```json
{
  "success": true,
  "data": {
    /* note object */
  }
}
```

### GET /api/notes

Response 200:

```json
{
  "success": true,
  "count": 2,
  "data": [
    /* notes */
  ]
}
```

### GET /api/notes/:id

Response 200:

```json
{
  "success": true,
  "data": {
    /* note */
  }
}
```

### PATCH /api/notes/:id

Request body can include `title`, `content`, `tags`.
Response 200: updated note.

### DELETE /api/notes/:id

Response 200: `{ success: true, message: 'Note deleted' }`

## Example Curl Commands

```bash
# Create
curl -X POST http://localhost:5002/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Grocery","content":"Buy milk","tags":["home"]}'

# List
curl -X GET http://localhost:5002/api/notes -H "Authorization: Bearer <token>"

# Get
curl -X GET http://localhost:5002/api/notes/<id> -H "Authorization: Bearer <token>"

# Update
curl -X PATCH http://localhost:5002/api/notes/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"content":"Updated content"}'

# Delete
curl -X DELETE http://localhost:5002/api/notes/<id> -H "Authorization: Bearer <token>"
```

## Postman Testing Guide

1. Create collection `Note Service`.
2. Add request for each endpoint above.
3. For authorization, set an environment variable `authToken` and add header `Authorization: Bearer {{authToken}}`.
4. Use token obtained from Auth Service `/api/auth/login`.

## Debugging Tips

- Ensure `MONGO_URI` is correct and points to a Mongo instance reachable from this service.
- If sharing users between services, use the same MongoDB and `users` collection.
- Check `logs/app.log` for errors.
- Verify JWT secret matches the one used by Auth Service.

## How to verify

1. Make sure MongoDB is running.
2. Start Auth Service and register/login to obtain JWT.
3. Start Note Service:

```bash
cd Gateway/noteService
npm install
copy .env.example .env
# edit .env if needed to set MONGO_URI and JWT_SECRET
node -e "const app=require('./src/app'); const http=require('http'); const server=app.listen(5011, ()=>{ http.get('http://127.0.0.1:5011/health', res=>{ console.log('STATUS', res.statusCode); server.close(()=>process.exit(0)); }).on('error', e=>{ console.error(e); server.close(()=>process.exit(1)); }); });"
```

4. Use curl/Postman to call the endpoints.

## Git Commit Message

```
feat(notes): implement phase 2 notes service with JWT-protected CRUD
```
