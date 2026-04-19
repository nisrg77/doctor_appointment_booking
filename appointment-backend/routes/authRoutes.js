const express = require('express');
const router = express.Router();

// Import controller functions
const { register, login, getMe } = require('../controllers/authController');

// Import the protect middleware (for the /me route)
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────
// ROUTE DEFINITIONS
//
// Remember: These are mounted at /api/auth in index.js
// So:
//   router.post('/register') → POST /api/auth/register
//   router.post('/login')    → POST /api/auth/login
//   router.get('/me')        → GET  /api/auth/me
// ─────────────────────────────────────────────────────────────────

// Public routes — no token needed
router.post('/register', register);
router.post('/login', login);

// Protected route — token required
// protect runs first → if valid token → getMe runs
router.get('/me', protect, getMe);

module.exports = router;
