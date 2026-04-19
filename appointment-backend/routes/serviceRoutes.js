const express = require('express');
const router = express.Router();

// Import controller functions
const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');

// Import middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────
// ROUTE DEFINITIONS
//
// These are mounted at /api/services in index.js
//
// Access Levels:
//   Public  → no middleware needed
//   Private → protect (JWT required)
//   Admin   → protect + adminOnly (JWT + role check)
// ─────────────────────────────────────────────────────────────────

// Public Routes — anyone can browse services (even before login)
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Admin-only Routes — require valid JWT + admin role
// Middleware chain: protect → adminOnly → controller
// If protect fails → 401, if adminOnly fails → 403, else → controller runs
router.post('/',     protect, adminOnly, createService);
router.put('/:id',   protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
