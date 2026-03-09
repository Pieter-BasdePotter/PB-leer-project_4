const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

const db = require('./models');

// Log incoming requests (method + path + remote address)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.path} - from ${req.ip}`);
  next();
});

// Routers
const postsRouter = require('./routes/posts');
app.use("/posts", postsRouter);
const commentsRouter = require('./routes/Comments');
app.use("/comments", commentsRouter);
// const usersRouter = require('./routes/Users');
// app.use("/auth", usersRouter);


// sync() without alter: all columns are already in MySQL.
// alter:true causes ER_DUP_FIELDNAME on every restart because Sequelize
// bundles ADD column + ADD CONSTRAINT even when the column already exists.
db.sequelize.sync().then(() => {    
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    });
}).catch((err) => {
    console.error('Failed to sync database:', err);
    process.exit(1);
});
