import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────
// GuestRoute — prevents logged-in users from seeing login/register
//
// WHY:
//   If a user is already logged in and navigates to /login,
//   they should be sent to /dashboard automatically — not shown
//   the login form again.
//
// USAGE in App.jsx:
//   <Route element={<GuestRoute />}>
//     <Route path="/login"    element={<LoginPage />} />
//     <Route path="/register" element={<RegisterPage />} />
//   </Route>
// ─────────────────────────────────────────────────────────────────

const GuestRoute = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
    }

    return <Outlet />;
};

export default GuestRoute;
