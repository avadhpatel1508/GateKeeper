# API Gateway (Phase 3)

## Goal

Expose a single public entrypoint that proxies requests to the Auth and Notes services.

## Folder structure

```
Gateway/
  src/
    app.js
    server.js
    config/
      logger.js
    middleware/
      errorHandler.js
    utils/
      appError.js
  .env.example
  package.json
```

## How it works

- Client sends requests to the Gateway (e.g. `/api/auth/register`, `/api/notes`).
- The Gateway forwards requests to the appropriate microservice using `http-proxy-middleware`.
- The Gateway centralizes logging and error handling.

## Environment variables

- `PORT` — Gateway HTTP port (default 3000)
- `AUTH_SERVICE_URL` — Auth service base URL (e.g. http://localhost:5001)
- `NOTES_SERVICE_URL` — Notes service base URL (e.g. http://localhost:5002)

## Start locally

```bash
cd Gateway
npm install
copy .env.example .env
node src/server.js
```

## Proxy routes

- `/api/auth/*` -> `${AUTH_SERVICE_URL}/api/auth/*`
- `/api/notes/*` -> `${NOTES_SERVICE_URL}/api/notes/*`

## Health check

- `GET /health` returns gateway health.

## Debugging

- Check `logs/app.log` for gateway logs.
- If you see `Bad gateway` responses, verify target services are running and reachable.

## Next

Phase 4 will move JWT verification into the Gateway. Follow-up will implement JWT validation, header forwarding, and service trust.
