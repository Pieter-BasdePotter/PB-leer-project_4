# Copilot Instructions

## Architecture

Full-stack app: React frontend (`client/`) + Express/Sequelize backend (`server/`).

- **Entry point**: `app.js` at project root is a legacy file — it mounts only the Comments router. The real server is **`server/index.js`**, which mounts both `/posts` and `/comments` with CORS enabled for `http://localhost:3000`.
- **Frontend**: React SPA with three pages — `Home`, `Post` (detail view), `CreatePost`. All Axios calls use hardcoded base URL `http://localhost:3001`.
- **Backend**: Express 5 + Sequelize 6 against MySQL (`tutorialdb`). DB credentials live in `server/config/config.json`.
- **Users model** (`server/models/Users.js`) and its router (`server/routes/Users.js`) exist but are not mounted — auth is intentionally inactive.

## Running the App

```bash
# Backend (from server/)
npm start          # nodemon server/index.js

# Frontend (from client/)
npm start          # react-scripts start, port 3000
```

## Client Tests (React Testing Library / Jest)

```bash
cd client

# Run all tests (watch mode)
npm test

# Run a single test file non-interactively
npm test -- --watchAll=false --testPathPattern=Home
```

## Key Conventions

### Schema migrations — never use `alter: true`
`sync({ alter: true })` is disabled in `server/index.js` because Sequelize 6 generates duplicate `ADD COLUMN` + `ADD CONSTRAINT` DDL, causing `ER_DUP_FIELDNAME` on restart.

**Adding a new column** requires two steps:
1. Add the field to the Sequelize model.
2. Add an `ensureXxxColumn` guard in `server/index.js` (see `ensurePostsLikesColumn` as the pattern): query `INFORMATION_SCHEMA.COLUMNS`, and only issue `ALTER TABLE … ADD COLUMN` when the column is absent.

### Model auto-loading
`server/models/index.js` auto-requires every `.js` file in the models directory. Each model file **must** export a function `(sequelize, DataTypes) => ModelClass`. Exporting anything else throws at startup.

### Model naming inconsistency
The Post model is defined as `'Post'` (singular); the Comments model as `'Comments'` (plural). Reference them as `models.Post` and `models.Comments`.

### Async route handlers — Express 5
The server uses Express 5 (`^5.2.1`), which propagates rejected async route handler promises automatically. Only add `try/catch` when you need a custom error response (see the like endpoints for examples).

### Request body whitelisting
Always destructure `req.body` to whitelist fields — never pass the raw body object to `.create()` or `.update()`:

```js
// Good
const { commentBody, postId } = req.body;
await Comments.create({ commentBody, postId });

// Bad — mass assignment risk
await Comments.create(req.body);
```

### Like endpoints pattern
Both `Post` and `Comments` expose `PUT /:id/like`. Use Sequelize `.increment('likes')` followed by `.reload()` to return the server-authoritative count. The client guards stale state with `Math.max(prev.likes ?? 0, response.data.likes)`.

### Forms — Formik
`CreatePost.js` uses Formik (`<Formik>`, `<Form>`, `<Field>`, `<ErrorMessage>`). Follow this pattern for any new client-side forms.
