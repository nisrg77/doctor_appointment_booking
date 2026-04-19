const mongoose = require('mongoose');

/**
 * Appointment Schema
 *
 * This is the CORE model of our entire application.
 * Every booking action (create, cancel, approve, reject) modifies this.
 *
 * KEY DESIGN: References to User and Service (not embedded documents)
 * WHY references, not embedded?
 *   - A user can have MANY appointments → don't duplicate user data each time
 *   - A service can be in MANY appointments → don't duplicate service data
 *   - References = one source of truth, updated everywhere automatically
 */
const appointmentSchema = new mongoose.Schema(
    {
        // ── WHO booked it? ───────────────────────────────────────────
        // ObjectId is MongoDB's unique identifier type
        // ref: 'User' tells Mongoose which model to populate from
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },

        // ── WHAT service is being booked? ────────────────────────────
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: [true, 'Service is required']
        },

        // ── WHEN is the appointment? ─────────────────────────────────
        date: {
            type: Date,
            required: [true, 'Appointment date is required']
        },

        // Time as a string like "10:30 AM", "14:00"
        // WHY string and not part of Date?
        // Gives flexibility for different time formats and slot systems
        time: {
            type: String,
            required: [true, 'Appointment time is required'],
            trim: true
        },

        // ── CURRENT STATUS (State Machine) ───────────────────────────
        // pending  → just booked, waiting for admin review
        // approved → admin confirmed it
        // rejected → admin declined it
        // cancelled → user cancelled before appointment
        status: {
            type: String,
            enum: {
                values: ['pending', 'approved', 'rejected', 'cancelled'],
                message: '{VALUE} is not a valid status'
            },
            default: 'pending'
        },

        // ── OPTIONAL NOTES ───────────────────────────────────────────
        // User can describe their issue/request when booking
        notes: {
            type: String,
            trim: true,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
            default: ''
        }
    },
    {
        timestamps: true  // adds createdAt + updatedAt automatically
    }
);

// ── INDEX for performance ─────────────────────────────────────────
// When users fetch "my appointments", we always query by user ID.
// Index makes this lookup fast even with millions of documents.
appointmentSchema.index({ user: 1, date: -1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
