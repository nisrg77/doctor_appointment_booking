const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

// ═══════════════════════════════════════════════════════════════════
// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (logged-in users)
// ═══════════════════════════════════════════════════════════════════
const bookAppointment = async (req, res) => {
    try {
        const { serviceId, date, time, notes } = req.body;

        // STEP 1: Validate required fields
        if (!serviceId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Service, date, and time are required'
            });
        }

        // STEP 2: Verify the service exists and is active
        // We don't want users booking a deleted/disabled service
        const service = await Service.findById(serviceId);
        if (!service || !service.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or no longer available'
            });
        }

        // STEP 3: Time checks and double-booking prevention

        // Prevent booking in the past
        // Using string parsing to create a local Date comparison
        // Assuming date is "YYYY-MM-DD" and time is "HH:MM"
        const bookingDateTime = new Date(`${date.split('T')[0]}T${time}:00`);
        if (bookingDateTime < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book an appointment in the past'
            });
        }

        // Check if ANYONE already has a pending/approved appointment
        // for the SAME service on the SAME date at the SAME time
        const existingBooking = await Appointment.findOne({
            service: serviceId,
            date: new Date(date),
            time: time,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked for this service'
            });
        }

        // STEP 4: Create the appointment
        // req.user._id comes from the protect middleware (set from JWT)
        const appointment = await Appointment.create({
            user: req.user._id,    // automatically populated from JWT
            service: serviceId,
            date: new Date(date),  // ensure proper Date type storage
            time,
            notes: notes || '',
            status: 'pending'      // always starts as pending
        });

        // STEP 5: Populate user and service data for the response
        // Without populate → { user: "id...", service: "id..." }
        // With populate    → { user: { name, email }, service: { name, duration } }
        const populated = await appointment.populate([
            { path: 'user', select: 'name email' },
            { path: 'service', select: 'name duration price category' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully! Awaiting confirmation.',
            data: populated
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID format'
            });
        }
        console.error('bookAppointment Error:', error);
        res.status(500).json({ success: false, message: 'Failed to book appointment' });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Get MY appointments (logged-in user only sees their own)
// @route   GET /api/appointments
// @access  Private (user)
// ═══════════════════════════════════════════════════════════════════
const getMyAppointments = async (req, res) => {
    try {
        // Filter by the current user's ID — users can ONLY see their own appointments
        // This is a fundamental security rule: never expose other users' data
        const appointments = await Appointment.find({ user: req.user._id })
            .populate('service', 'name duration price category')
            .populate('user', 'name email')
            .sort({ date: -1 });  // Most recent first

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });

    } catch (error) {
        console.error('getMyAppointments Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Cancel an appointment (user cancels their OWN booking)
// @route   PUT /api/appointments/:id/cancel
// @access  Private (user — must be the owner)
// ═══════════════════════════════════════════════════════════════════
const cancelAppointment = async (req, res) => {
    try {
        // STEP 1: Find the appointment by ID
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // STEP 2: OWNERSHIP CHECK — critical security rule
        // req.user._id (from JWT) must match appointment.user (who booked it)
        // .toString() because one is ObjectId type and one might be string
        if (appointment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized. You can only cancel your own appointments.'
            });
        }

        // STEP 3: Business logic — can only cancel pending or approved appointments
        if (['rejected', 'cancelled'].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel an appointment that is already ${appointment.status}`
            });
        }

        // STEP 4: Update status to cancelled
        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: appointment
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid appointment ID' });
        }
        console.error('cancelAppointment Error:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel appointment' });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Get ALL appointments (admin view — sees everyone's bookings)
// @route   GET /api/appointments/all
// @access  Private — Admin only
// ═══════════════════════════════════════════════════════════════════
const getAllAppointments = async (req, res) => {
    try {
        // Admin sees ALL appointments, not filtered by user
        // We populate both user AND service for the full admin dashboard view
        const appointments = await Appointment.find()
            .populate('user', 'name email role')
            .populate('service', 'name duration price category')
            .sort({ createdAt: -1 });  // most recently booked first

        // Group counts by status — useful for admin dashboard stats
        const stats = {
            total: appointments.length,
            pending:   appointments.filter(a => a.status === 'pending').length,
            approved:  appointments.filter(a => a.status === 'approved').length,
            rejected:  appointments.filter(a => a.status === 'rejected').length,
            cancelled: appointments.filter(a => a.status === 'cancelled').length,
        };

        res.status(200).json({
            success: true,
            stats,
            data: appointments
        });

    } catch (error) {
        console.error('getAllAppointments Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch all appointments' });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Approve or Reject an appointment (admin decision)
// @route   PUT /api/appointments/:id/status
// @access  Private — Admin only
// ═══════════════════════════════════════════════════════════════════
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // STEP 1: Admin can only set these specific statuses
        const allowedStatuses = ['approved', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Admin can only set: ${allowedStatuses.join(', ')}`
            });
        }

        // STEP 2: Find the appointment
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // STEP 3: Can only approve/reject a PENDING appointment
        // Prevents overriding a user's cancellation or double-approving
        if (appointment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot update a ${appointment.status} appointment. Only pending appointments can be approved or rejected.`
            });
        }

        // STEP 4: Apply the new status and save
        appointment.status = status;
        await appointment.save();

        // Populate for a rich response
        await appointment.populate([
            { path: 'user', select: 'name email' },
            { path: 'service', select: 'name duration' }
        ]);

        res.status(200).json({
            success: true,
            message: `Appointment ${status} successfully`,
            data: appointment
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid appointment ID' });
        }
        console.error('updateAppointmentStatus Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update appointment status' });
    }
};


module.exports = {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getAllAppointments,
    updateAppointmentStatus
};
