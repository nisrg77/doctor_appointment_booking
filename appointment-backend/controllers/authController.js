const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ═══════════════════════════════════════════════════════════════════
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (no token needed)
// ═══════════════════════════════════════════════════════════════════
const register = async (req, res) => {
    try {
        // STEP 1: Pull data from request body
        // req.body is available because of express.json() middleware in index.js
        const { name, email, password, role } = req.body;

        // STEP 2: Validate — make sure required fields exist
        // In production we use express-validator (Stage 9), but manual checks are fine for now
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        // STEP 3: Check if this email is already registered
        // MongoDB query: find ONE document where email matches
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // STEP 4: Hash the password
        // bcrypt.hash(plainText, saltRounds)
        // Salt rounds = 10 means bcrypt runs the hash function 2^10 = 1024 times
        // Higher = more secure but slower. 10 is the industry sweet spot.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // STEP 5: Create and save the user
        // We NEVER store the plain password — only hashedPassword goes to DB
        // Role defaults to "user" unless explicitly set to "admin"
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user' // Prevent privilege escalation
        });

        // STEP 6: Generate a JWT token for immediate login after registration
        const token = generateToken(user._id);

        // STEP 7: Send back the token + safe user data (NEVER send password)
        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        // Mongoose duplicate key error (email already exists at DB level)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered'
            });
        }
        console.error('Register Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Login an existing user
// @route   POST /api/auth/login
// @access  Public (no token needed)
// ═══════════════════════════════════════════════════════════════════
const login = async (req, res) => {
    try {
        // STEP 1: Get email and password from request body
        let { email, password } = req.body;
        
        // Trim whitespace to prevent common login failures
        if (email) email = email.trim();
        if (password) password = password.trim();

        // STEP 2: Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // STEP 3: Find user by email
        // We use .select('+password') because in the User model we can hide
        // the password field by default. Here we explicitly need it to compare.
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            // SECURITY TIP: Don't say "email not found" — vague message prevents
            // attackers from knowing which emails are registered
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // STEP 4: Compare the plain password with the stored hash
        // bcrypt.compare(plainText, hash) → returns true or false
        // It re-hashes the plain text and compares — you CAN'T reverse a hash!
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // STEP 5: Generate a fresh token
        const token = generateToken(user._id);

        // STEP 6: Send token + user data (without password)
        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};


// ═══════════════════════════════════════════════════════════════════
// @desc    Get the currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (requires valid JWT token)
// ═══════════════════════════════════════════════════════════════════
const getMe = async (req, res) => {
    // By the time we reach here, the `protect` middleware has already:
    // 1. Verified the token
    // 2. Found the user in DB
    // 3. Attached it to req.user
    //
    // So we just send back what we already have — no extra DB call needed!
    res.status(200).json({
        success: true,
        user: req.user
    });
};


module.exports = { register, login, getMe };
