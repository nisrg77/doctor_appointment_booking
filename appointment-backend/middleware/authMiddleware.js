const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ═══════════════════════════════════════════════════════════════════
// protect — Verifies JWT token on protected routes
//
// HOW TO USE in a route:
//   router.get('/profile', protect, getProfile)
//                          ↑
//                    runs BEFORE getProfile
//
// WHAT IT DOES:
//   1. Reads the Authorization header
//   2. Extracts the token ("Bearer <token>")
//   3. Verifies the token using JWT_SECRET
//   4. Finds the user in DB from the decoded token's id
//   5. Attaches user to req.user so controllers can access it
//   6. Calls next() to hand off to the actual controller
// ═══════════════════════════════════════════════════════════════════
const protect = async (req, res, next) => {
    try {
        let token;

        // STEP 1: Check if Authorization header exists and starts with "Bearer"
        // Format expected: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // STEP 2: Extract just the token part (split on space, take index 1)
            // "Bearer abc123" → ["Bearer", "abc123"] → "abc123"
            token = req.headers.authorization.split(' ')[1];
        }

        // STEP 3: If no token was found at all, reject the request
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided. Please log in.'
            });
        }

        // STEP 4: Verify the token
        // jwt.verify() does TWO things:
        //   a) Checks the signature (was it signed with OUR secret?)
        //   b) Checks if it's expired
        // If either fails → it THROWS an error → caught by catch block
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded = { id: "64abc...", iat: 1234567890, exp: 1235172690 }

        // STEP 5: Find the user in DB using the ID from the token
        // WHY not just use decoded.id directly?
        // Because the user might have been deleted after the token was issued.
        // We verify they still exist in the database.
        const user = await User.findById(decoded.id).select('-password');
        // .select('-password') = return everything EXCEPT the password field

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is valid but user no longer exists'
            });
        }

        // STEP 6: Attach user to the request object
        // Now any controller after this middleware can access req.user
        req.user = user;

        // STEP 7: Pass control to the next function (the actual controller)
        next();

    } catch (error) {
        // jwt.verify() throws these specific errors:
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please log in again.'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};


// ═══════════════════════════════════════════════════════════════════
// adminOnly — Checks if the logged-in user has the "admin" role
//
// IMPORTANT: This ALWAYS runs AFTER protect middleware
// Because it needs req.user (which protect sets up)
//
// HOW TO USE in a route:
//   router.delete('/:id', protect, adminOnly, deleteService)
//                         ↑        ↑
//                    verify JWT  check role
// ═══════════════════════════════════════════════════════════════════
const adminOnly = (req, res, next) => {
    // req.user is available because protect() ran before this
    if (req.user && req.user.role === 'admin') {
        next(); // They're an admin — let them through
    } else {
        res.status(403).json({
            // 403 Forbidden = authenticated but NOT authorized
            // 401 Unauthorized = not authenticated at all
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};


module.exports = { protect, adminOnly };
