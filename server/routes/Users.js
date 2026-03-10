const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email, and password are required' });
    }
    if (username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const existingEmail = await models.Users.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        const existingUsername = await models.Users.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await models.Users.create({ username, email, password: hashedPassword });

        res.status(201).json({ id: user.id, username: user.username, email: user.email });
    } catch (err) {
        // Race condition: a concurrent request slipped past the findOne checks
        if (err.name === 'SequelizeUniqueConstraintError') {
            const field = err.errors?.[0]?.path || 'field';
            return res.status(409).json({ error: `${field} already in use` });
        }
        console.error('[AUTH] Register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }

    try {
        const user = await models.Users.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({ token, username: user.username });
    } catch (err) {
        console.error('[AUTH] Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
