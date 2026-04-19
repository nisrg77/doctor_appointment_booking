import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

// ─────────────────────────────────────────────────────────────────
// AuthContext — Global authentication state
//
// WHY Context?
//   - Multiple components need to know: "is the user logged in? who are they?"
//   - Passing this via props would be messy (prop drilling)
//   - Context makes auth state available anywhere in the component tree
//
// What this provides:
//   user       → the logged-in user object (or null)
//   token      → the JWT string (or null)
//   loading    → true while we check if a stored token is still valid
//   login()    → call after successful login, stores token + user
//   logout()   → clears everything, redirects to /login
//   isAdmin    → shortcut boolean: user.role === 'admin'
// ─────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [token, setToken]     = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);  // true until we verify stored token

    // ── Restore session on page refresh ────────────────────────────
    // If a token exists in localStorage, verify it with GET /api/auth/me
    // This prevents the user from being logged out on every page refresh
    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/auth/me');
                setUser(res.data.user);
                setToken(storedToken);
            } catch (err) {
                // Token is invalid or expired — clean up
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    // ── login() — called after successful POST /api/auth/login ──────
    const login = useCallback((userData, jwtToken) => {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
    }, []);

    // ── logout() — clear everything ────────────────────────────────
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ── Custom hook → makes consumption cleaner ─────────────────────
// Instead of: const { user } = useContext(AuthContext)
// We write:   const { user } = useAuth()
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside an <AuthProvider>');
    }
    return context;
};

export default AuthContext;
