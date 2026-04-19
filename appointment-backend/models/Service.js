const mongoose = require('mongoose');

/**
 * Service Schema
 *
 * Represents a bookable service in the system.
 * Examples: "Doctor Consultation", "Hair Salon", "Dental Checkup"
 *
 * WHY isActive?
 * Instead of deleting a service (which would break existing appointments
 * that reference it), we "soft delete" it by setting isActive to false.
 * This is a common production pattern — data is rarely truly deleted.
 */
const serviceSchema = new mongoose.Schema(
    {
        // Service name — shown to users in the booking UI
        name: {
            type: String,
            required: [true, 'Service name is required'],
            trim: true,              // removes leading/trailing spaces
            maxlength: [100, 'Service name cannot exceed 100 characters']
        },

        // Short description shown on the service card
        description: {
            type: String,
            required: [true, 'Service description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },

        // How long the appointment lasts (in minutes)
        // e.g., 30, 45, 60, 90
        duration: {
            type: Number,
            required: [true, 'Duration is required'],
            min: [5, 'Duration must be at least 5 minutes'],
            max: [480, 'Duration cannot exceed 8 hours (480 minutes)']
        },

        // Optional price field — useful for future billing features
        price: {
            type: Number,
            default: 0,
            min: [0, 'Price cannot be negative']
        },

        // Soft delete flag — deactivated services won't show to users
        // but existing appointments referencing them still work
        isActive: {
            type: Boolean,
            default: true
        },

        // Optional category — e.g., "Medical", "Cosmetic", "Dental"
        // Useful for filtering services on the frontend
        category: {
            type: String,
            trim: true,
            default: 'General'
        }
    },
    {
        // timestamps: true → Mongoose auto-adds createdAt and updatedAt
        timestamps: true
    }
);

// Create the model from the schema
// 'Service' → MongoDB will create a collection called 'services' (lowercase + plural)
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
