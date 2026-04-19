const jwt = require('jsonwebtoken');

/**
 * generateToken
 *
 * WHY a separate utility?
 * Both register() AND login() need to create a token.
 * Instead of copy-pasting the same jwt.sign() call in both places,
 * we extract it here. If we ever change token logic (add claims,
 * change expiry), we only change it in ONE place.
 *
 * @param {string} userId - The MongoDB _id of the user
 * @returns {string}      - A signed JWT string
 *
 * HOW jwt.sign() works:
 *   jwt.sign(payload, secret, options)
 *   → payload : data embedded in the token (keep it small — avoid passwords!)
 *   → secret  : your JWT_SECRET from .env (signs + verifies the token)
 *   → options : expiry, algorithm, etc.
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },           // Payload — just the user's ID is enough
        process.env.JWT_SECRET,   // Secret key from .env
        { expiresIn: process.env.JWT_EXPIRE || '7d' } // Token expires in 7 days
    );
};

module.exports = generateToken;
