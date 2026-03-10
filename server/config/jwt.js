// Single source of truth for JWT configuration.
// Both routes/Users.js and middleware/auth.js import from here so the secret
// and the production guard are never duplicated or accidentally diverged.

const JWT_SECRET = process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET environment variable must be set in production');
    }
    console.warn('[AUTH] JWT_SECRET not set — using insecure dev default. Set JWT_SECRET in production.');
    return 'dev-secret-change-in-production';
})();

const JWT_EXPIRES_IN = '7d';

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
