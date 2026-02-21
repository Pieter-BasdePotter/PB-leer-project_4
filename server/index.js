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


db.sequelize.sync().then(() => {    
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    });
});
