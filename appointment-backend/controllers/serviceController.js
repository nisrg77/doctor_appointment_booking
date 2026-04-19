const Service = require('../models/Service');

// ═══════════════════════════════════════════════════════════════════
// @desc    Get all ACTIVE services
// @route   GET /api/services
// @access  Public — no login required
// ═══════════════════════════════════════════════════════════════════
const getAllServices = async (req, res) => {
    try {
        // Only return services where isActive is true
        // Users shouldn't see disabled/hidden services
        // .sort({ createdAt: -1 }) → newest first
        const services = await Service.find({ isActive: true })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,   // handy for the frontend to show "X services available"
            data: services
        });

    } catch (error) {
        console.error('getAllServices Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services'
        });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Get a single service by ID
// @route   GET /api/services/:id
// @access  Public
// ═══════════════════════════════════════════════════════════════════
const getServiceById = async (req, res) => {
    try {
        // req.params.id comes from the URL: /api/services/64abc123...
        const service = await Service.findById(req.params.id);

        // Handle service not found
        if (!service || !service.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });

    } catch (error) {
        // Mongoose throws CastError when the ID format is invalid
        // e.g., /api/services/not-a-valid-id
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID format'
            });
        }
        console.error('getServiceById Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Create a new service
// @route   POST /api/services
// @access  Private — Admin only
// ═══════════════════════════════════════════════════════════════════
const createService = async (req, res) => {
    try {
        // Destructure only the fields we expect — ignore anything extra
        // This prevents mass assignment attacks (sending unexpected fields)
        const { name, description, duration, price, category } = req.body;

        // Basic validation — Mongoose will also validate, but this gives
        // a cleaner error message before hitting the DB
        if (!name || !description || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, and duration are required'
            });
        }

        // Create the service document in MongoDB
        const service = await Service.create({
            name,
            description,
            duration,
            price: price || 0,
            category: category || 'General'
        });

        // 201 Created — the standard for successful resource creation
        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });

    } catch (error) {
        // Mongoose validation error — e.g., name too long, duration out of range
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }
        console.error('createService Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create service' });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Update an existing service
// @route   PUT /api/services/:id
// @access  Private — Admin only
// ═══════════════════════════════════════════════════════════════════
const updateService = async (req, res) => {
    try {
        // Whitelist updatable fields — admin can't change things like _id
        const { name, description, duration, price, category, isActive } = req.body;

        // Build an update object with only the fields that were provided
        // This way a partial update (e.g., just name) doesn't erase other fields
        const updateFields = {};
        if (name !== undefined)        updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (duration !== undefined)    updateFields.duration = duration;
        if (price !== undefined)       updateFields.price = price;
        if (category !== undefined)    updateFields.category = category;
        if (isActive !== undefined)    updateFields.isActive = isActive;

        // findByIdAndUpdate options:
        //   new: true         → return the UPDATED document (not the old one)
        //   runValidators: true → run schema validators on the update too
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join('. ') });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid service ID' });
        }
        console.error('updateService Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update service' });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Delete a service (soft delete — sets isActive to false)
// @route   DELETE /api/services/:id
// @access  Private — Admin only
// ═══════════════════════════════════════════════════════════════════
const deleteService = async (req, res) => {
    try {
        // WHY soft delete instead of actual delete?
        //
        // If we use Service.findByIdAndDelete(), then any existing Appointment
        // document that references this service's ID will have a broken reference.
        //
        // Soft delete = set isActive to false → service vanishes from public view
        // but existing appointment records remain intact and valid.
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service deleted (deactivated) successfully'
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid service ID' });
        }
        console.error('deleteService Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete service' });
    }
};


// Export all 5 controller functions
module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
