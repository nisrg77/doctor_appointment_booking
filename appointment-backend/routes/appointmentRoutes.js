const express = require('express');
const router = express.Router();

// Import controller functions
const {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getAllAppointments,
    updateAppointmentStatus
} = require('../controllers/appointmentController');

// Import middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────
// ROUTE ORDER MATTERS!
//
// ⚠️ '/all' must come BEFORE '/:id'
// WHY? If '/:id' came first, Express would treat "all" as an ID
// and try to find an appointment with _id = "all" → CastError!
//
// Always define specific named routes BEFORE parameterized routes.
// ─────────────────────────────────────────────────────────────────

// ── USER ROUTES ───────────────────────────────────────────────────

// GET  /api/appointments        → my appointments (current user)
router.get('/', protect, getMyAppointments);

// POST /api/appointments        → book a new appointment
router.post('/', protect, bookAppointment);

// PUT  /api/appointments/:id/cancel  → cancel MY appointment
router.put('/:id/cancel', protect, cancelAppointment);

// ── ADMIN ROUTES ─────────────────────────────────────────────────

// GET  /api/appointments/all         → ALL appointments (admin dashboard)
// ⚠️ Must be before /:id — "all" would be treated as an ID otherwise!
router.get('/all', protect, adminOnly, getAllAppointments);

// PUT  /api/appointments/:id/status  → approve or reject (admin)
router.put('/:id/status', protect, adminOnly, updateAppointmentStatus);

module.exports = router;
