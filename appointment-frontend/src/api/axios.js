import axios from 'axios';

// ─────────────────────────────────────────────────────────────────
// Base Axios instance — all API calls go through here
//
// WHY a custom instance?
//   - We set the baseURL once here (not in every component)
//   - We attach the JWT token automatically on every request
//   - If the token expires → we can handle it in ONE place (interceptor)
// ─────────────────────────────────────────────────────────────────

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request Interceptor ───────────────────────────────────────────
// Runs BEFORE every request is sent.
// Reads the token from localStorage and attaches it as a Bearer token.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────
// Runs AFTER every response comes back.
// If we get 401 (unauthorized) → token is expired → force logout.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login (without React Router, just window.location)
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
