require('dotenv').config();         // MUST be first — loads .env variables
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────────────────────────
// STEP 1: CONNECT TO MONGODB
// We call this immediately when the server starts.
// If it fails, connectDB() will call process.exit(1) and stop everything.
// ─────────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────────
// STEP 2: GLOBAL MIDDLEWARE
//
// Middleware = functions that run on EVERY request, before routes.
// Think of it as a security/pre-processing checkpoint.
//
// ORDER MATTERS — middleware runs top to bottom.
// ─────────────────────────────────────────────────────────────────

app.use(cors());
// WHY cors()? Our React app runs on localhost:3000. Our API is on localhost:5000.
// Browsers block cross-origin requests by default (CORS policy).
// cors() tells the browser: "this server allows requests from other origins."

app.use(express.json());
// WHY express.json()? When React sends POST data (e.g., { email, password }),
// it arrives as raw text. express.json() parses it into req.body (a JS object).

// ─────────────────────────────────────────────────────────────────
// STEP 3: ROUTE WIRING
//
// These lines say: "Any request starting with /api/auth goes
// to authRoutes.js to find the matching handler."
//
// This keeps index.js clean. All the URL logic lives in the route files.
// ─────────────────────────────────────────────────────────────────

// Health Check — standard practice in every production app
// Visit http://localhost:5000/api/health to confirm server + DB status
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '✅ Server is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Auth routes  →  POST /api/auth/register,  POST /api/auth/login
app.use('/api/auth', require('./routes/authRoutes'));

// Service routes  →  GET/POST/PUT/DELETE /api/services
app.use('/api/services', require('./routes/serviceRoutes'));

// Appointment routes  →  GET/POST/PUT/DELETE /api/appointments
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// ─────────────────────────────────────────────────────────────────
// STEP 3.5: SERVE FRONTEND (PRODUCTION)
//
// In production, we serve the built React files from the dist/ folder.
// This allows us to run the whole app on a single port (e.g., 5000).
// ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    // Serve static assets
    app.use(express.static(path.join(__dirname, '../appointment-frontend/dist')));

    // Handle React routing, return all non-API requests to index.html
    // NOTE: Express 5 requires named wildcards — bare '*' throws a PathError
    app.get('/{*path}', (req, res, next) => {
        // Only if it doesn't match an API route
        if (req.url.startsWith('/api')) return next();
        res.sendFile(path.join(__dirname, '../appointment-frontend/dist', 'index.html'));
    });
}

// ─────────────────────────────────────────────────────────────────
// STEP 4: 404 HANDLER
//
// If NO route above matched the request, this runs.
// It MUST be placed AFTER all routes.
// ─────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `❌ Route not found: ${req.method} ${req.originalUrl}`
    });
});

// ─────────────────────────────────────────────────────────────────
// STEP 5: GLOBAL ERROR HANDLER
//
// Any error passed with next(err) anywhere in the app lands here.
// The 4 parameters (err, req, res, next) are REQUIRED — Express
// identifies this as an error handler only when all 4 are present.
// ─────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Something went wrong on the server!'
    });
});

// ─────────────────────────────────────────────────────────────────
// STEP 6: START THE SERVER
// ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('─────────────────────────────────────');
    console.log(`🚀 Server  : http://localhost:${PORT}`);
    console.log(`🏥 Health  : http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth    : http://localhost:${PORT}/api/auth`);
    console.log(`🛎  Services: http://localhost:${PORT}/api/services`);
    console.log(`📅 Appts   : http://localhost:${PORT}/api/appointments`);
    console.log('─────────────────────────────────────');
});
