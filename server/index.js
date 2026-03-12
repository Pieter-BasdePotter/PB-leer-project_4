const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

const db = require('./models');
const authMiddleware = require('./middleware/auth');

// Log incoming requests (method + path + remote address)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.path} - from ${req.ip}`);
  next();
});

// Public auth routes
const usersRouter = require('./routes/Users');
app.use("/auth", usersRouter);

// Protected routes — require valid JWT
const postsRouter = require('./routes/posts');
app.use("/posts", authMiddleware, postsRouter);
const commentsRouter = require('./routes/Comments');
app.use("/comments", authMiddleware, commentsRouter);


// sync() without alter: all columns are already in MySQL.
// alter:true causes ER_DUP_FIELDNAME on every restart because Sequelize
// bundles ADD column + ADD CONSTRAINT even when the column already exists.
// Instead we run targeted one-off migrations for new columns.
const ensurePostsLikesColumn = () =>
    db.sequelize.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Posts' AND COLUMN_NAME = 'likes'`
    ).then(([rows]) => {
        if (rows.length === 0) {
            console.log('[MIGRATE] Adding likes column to Posts table...');
            return db.sequelize.query(
                'ALTER TABLE `Posts` ADD COLUMN `likes` INT NOT NULL DEFAULT 0'
            );
        }
    });

// Ensure Users table has the email column (added after initial schema creation).
const ensureUsersEmailColumn = () =>
    db.sequelize.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Users' AND COLUMN_NAME = 'email'`
    ).then(([rows]) => {
        if (rows.length === 0) {
            console.log('[MIGRATE] Adding email column to Users table...');
            return db.sequelize.query(
                'ALTER TABLE `Users` ADD COLUMN `email` VARCHAR(255) NOT NULL DEFAULT \'\''
            );
        }
    }).then(() =>
        // Ensure the unique index exists regardless of whether the column was just added.
        db.sequelize.query(
            `SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Users' AND INDEX_NAME = 'users_email_unique'`
        )
    ).then(([rows]) => {
        if (rows.length === 0) {
            console.log('[MIGRATE] Adding unique index on Users.email...');
            return db.sequelize.query(
                'ALTER TABLE `Users` ADD UNIQUE INDEX `users_email_unique` (`email`)'
            );
        }
    });

const ensureCommentsUserNameColumn = () =>
    db.sequelize.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Comments' AND COLUMN_NAME = 'userName'`
    ).then(([rows]) => {
        if (rows.length === 0) {
            console.log('[MIGRATE] Adding userName column to Comments table...');
            return db.sequelize.query(
                'ALTER TABLE `Comments` ADD COLUMN `userName` VARCHAR(255) NULL'
            );
        }
    });

db.sequelize.sync()
    .then(() => ensurePostsLikesColumn())
    .then(() => ensureUsersEmailColumn())
    .then(() => ensureCommentsUserNameColumn())
    .then(() => {
        app.listen(3001, () => {
            console.log('Server is running on port 3001');
        });
    }).catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
