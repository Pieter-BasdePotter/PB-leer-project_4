# PB Leer Project 4

A full-stack learning project built with React (client) and Express + MySQL (server).

## Tech Stack

- **Frontend:** React, React Router, Axios, Formik
- **Backend:** Node.js, Express, Sequelize, MySQL
- **Auth:** bcrypt

## Project Structure

```
PB-leer-project_4/
├── app.js          # Express entry point
├── client/         # React frontend
│   └── src/
│       └── pages/  # Home, Post, CreatePost
└── server/         # Backend
    ├── config/
    ├── models/
    └── routes/     # Comments, Posts
```

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Install dependencies

```bash
# Server
cd server
npm install

# Client
cd client
npm install
```

### Run the app

```bash
# Start backend (from project root)
node app.js

# Start frontend (from client/)
npm start
```

The backend runs on `http://localhost:3001` and the frontend on `http://localhost:3000`.

## API Routes

| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| GET    | /comments        | Get all comments   |
| POST   | /comments        | Create a comment   |
| GET    | /posts           | Get all posts      |
| POST   | /posts           | Create a post      |
