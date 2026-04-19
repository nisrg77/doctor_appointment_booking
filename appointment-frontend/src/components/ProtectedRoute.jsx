import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────
// ProtectedRoute — guards any route that requires login
//
// HOW IT WORKS:
//   Wrap a <Route> with this component.
//   If the user is NOT logged in → redirect to /login.
//   If they ARE logged in → render the child route (<Outlet />).
//
// USAGE in App.jsx:
//   <Route element={<ProtectedRoute />}>
//     <Route path="/dashboard" element={<DashboardPage />} />
//   </Route>
// ─────────────────────────────────────────────────────────────────

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // While checking stored token, render nothing (avoids flash redirect)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent" />
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
