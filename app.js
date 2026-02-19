const express = require('express');
const app = express();

app.use(express.json());

// simple request logger — place before routers
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// mount Comments router (adjust path if your entry file is elsewhere)
const commentsRouter = require('./server/routes/Comments');
app.use('/comments', commentsRouter);

app.listen(3001, () => console.log('listening on 3001'));