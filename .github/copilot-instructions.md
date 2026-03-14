# Copilot Instructions

## Build, test, and lint commands

Use the app-specific package scripts rather than the repository root package.

```bash
# Backend dev server (from server/)
npm start

# Frontend dev server (from client/)
npm start

# Frontend production build (from client/)
npm run build

# Frontend tests in watch mode (from client/)
npm test

# Run a single frontend test file non-interactively (from client/)
npm test -- --watchAll=false --runInBand --testPathPattern=Post.test.js
```

- There is no dedicated lint script in this repository.
- `server/package.json` has no real test runner: `npm test` is still the placeholder script that exits with `"Error: no test specified"`.

## High-level architecture

This is a React + Express/Sequelize full-stack app split between `client/` and `server/`.

- `server/index.js` is the real backend entry point. The root `app.js` is a legacy Express file that only mounts the Comments router and does not reflect the current app setup.
- The frontend is a React SPA. `client/src/App.js` wires public auth routes (`/login`, `/register`) and protects `/`, `/createpost`, and `/post/:id` with `ProtectedRoute`.
- Client authentication state lives in `client/src/context/AuthContext.js`, which persists `token` and `username` in `localStorage`.
- All client API calls are expected to go through `client/src/api/axios.js`. That wrapper hardcodes `http://localhost:3001`, adds the JWT bearer token on requests, and redirects `401` responses to `/login` except for `/auth/*` calls.
- The backend exposes public auth routes at `/auth` and protects `/posts` and `/comments` with `server/middleware/auth.js`, which validates JWTs and sets `req.user`.
- `server/routes/Users.js` handles register/login, while `server/routes/posts.js` and `server/routes/Comments.js` rely on `req.user.username` and store the username directly on posts and comments.
- The main UI flow is spread across three pages: `Home` loads the feed from `GET /posts`, `Post` loads one post plus `GET /comments/:postId` and supports commenting/likes, and `CreatePost` publishes new posts.
- Sequelize models are auto-loaded from `server/models/`, with `Post` having many `Comments` through `postId`. The app uses MySQL through `server/config/config.json`.

## Key conventions

### Use `server/index.js`, not the root `app.js`
When reasoning about the running app, follow `server/index.js`. The root `app.js` is only a leftover minimal server and should not be treated as the source of truth for routes or middleware.

### Schema changes use targeted guards, never `sync({ alter: true })`
`server/index.js` intentionally runs `db.sequelize.sync()` without `alter: true`, then applies one-off `ensureXxxColumn` checks against `INFORMATION_SCHEMA`. When adding a column, update the Sequelize model and add a matching guarded migration helper in `server/index.js`.

### Model files must match the auto-loader contract
`server/models/index.js` requires every `.js` file in `server/models/` and expects each one to export a function `(sequelize, DataTypes) => model`. Exporting anything else breaks startup.

### Model naming is inconsistent on purpose
The post model is registered as `models.Post`, while comments are registered as `models.Comments` and users as `models.Users`. Reuse those exact names when importing from `server/models`.

### Whitelist request bodies before persistence
Follow the route pattern in `server/routes/posts.js`, `server/routes/Comments.js`, and `server/routes/Users.js`: destructure allowed fields from `req.body` and pass an explicit object to Sequelize. Do not pass the raw body object into `.create()` or `.update()`.

### Express 5 async handlers can stay bare unless you need a custom response
The backend uses Express 5, so rejected async route handlers propagate automatically. Add `try/catch` only when you need to translate errors into specific HTTP responses, like the auth and like endpoints do.

### Keep client auth behavior centralized in `client/src/api/axios.js`
New client-side API code should import the shared Axios instance, not bare `axios`, so bearer-token injection and the `/auth/*` 401 exception keep working consistently.

### Protected writes derive identity from JWTs
Posts and comments do not accept `userName` from the client. The server derives it from `req.user.username`, so client code should only send the content fields needed for the action.

### Like endpoints return the server-authoritative count
Both posts and comments use `PUT /:id/like`, increment the `likes` column in Sequelize, reload the model, and return the new count. Update client state from the response instead of predicting the next value locally.

### Legacy comments may not have author names
`Comments.userName` is nullable for older rows. The `Post` page and its test expect missing comment authors to render as `Unknown user` with a `?` avatar, so preserve that fallback when changing comment rendering.

### Form pages use Formik
`CreatePost`, `Login`, and `Register` all follow the Formik pattern with inline validation and form status/error UI. Match that structure for new forms in the client.
