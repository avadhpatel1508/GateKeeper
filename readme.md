# GateKeeper

GateKeeper is a small full-stack project that combines a React frontend with an Express-based API gateway and two backend microservices for authentication and notes management. The gateway routes traffic to the downstream services and handles shared concerns such as authentication, rate limiting, and logging.

## Overview

This repository contains:

- A Vite + React frontend in Frontend/vite-project
- A Node.js API gateway in Gateway/src
- An authentication service in Gateway/authService
- A notes service in Gateway/noteService
- Environment-based configuration for development

## Tech Stack

- Frontend: React, Vite, ESLint
- Backend: Node.js, Express
- Authentication: JWT, bcrypt
- Database: MongoDB
- Cache/Rate limiting: Redis
- Logging: Winston
- Container support: Docker Compose file included in Gateway/

## Project Structure

```text
GateKeeper/
├── Frontend/
│   └── vite-project/
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── vite.config.js
├── Gateway/
│   ├── authService/
│   │   ├── src/
│   │   ├── package.json
│   │   └── .env
│   ├── noteService/
│   │   ├── src/
│   │   ├── package.json
│   │   └── .env
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── proxy/
│   ├── package.json
│   ├── .env
│   └── docker-compose.yaml
├── LICENSE
└── readme.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or newer
- npm 9 or newer
- MongoDB running locally or a MongoDB Atlas connection URI
- Redis running locally or a reachable Redis URL
- Git

## Environment Variables

Create a .env file in each service folder based on the examples below.

### Gateway (.env)

```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:5001
NOTES_SERVICE_URL=http://localhost:5002
LOG_LEVEL=info
NODE_ENV=development
REDIS_URL=redis://localhost:6379
```

### Auth Service (Gateway/authService/.env)

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/gateway-auth
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

### Notes Service (Gateway/noteService/.env)

```env
PORT=5002
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/gateway-notes
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

> If you are using MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

## Installation

Clone the repository and install dependencies for each project area:

```bash
git clone <your-repo-url>
cd GateKeeper

cd Gateway && npm install
cd authService && npm install
cd noteService && npm install
cd ../Frontend/vite-project && npm install
```

## Running the Application

Start each service in a separate terminal.

### 1) Start the gateway

```bash
cd Gateway
node src/server.js
```

### 2) Start the auth service

```bash
cd Gateway/authService
node src/server.js
```

### 3) Start the notes service

```bash
cd Gateway/noteService
node src/server.js
```

### 4) Start the frontend

```bash
cd Frontend/vite-project
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- Gateway: http://localhost:3000
- Auth service health: http://localhost:5001/health
- Notes service health: http://localhost:5002/health

## API Routes

### Gateway routes

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- GET /api/notes
- POST /api/notes
- GET /api/notes/:id
- PATCH /api/notes/:id
- DELETE /api/notes/:id

### Health endpoints

- GET /health on the gateway
- GET /health on the auth service
- GET /health on the notes service

## Notes

- The gateway proxies requests to the auth and notes services.
- JWT authentication is required for protected note routes.
- Redis must be available for gateway rate limiting and shared middleware features.
- The frontend is currently a Vite React starter and can be expanded to consume the gateway APIs.

## Troubleshooting

If something does not start correctly:

- Check that all required .env files exist and contain valid values.
- Make sure MongoDB is running and the MONGO_URI is correct.
- Make sure Redis is running and REDIS_URL is reachable.
- If a port is already in use, change the PORT value in the relevant .env file.
- Run npm install again inside the affected folder if dependencies are missing.

## License

This project is licensed under the ISC License.
