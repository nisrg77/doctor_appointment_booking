import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────
// AdminRoute — guards routes that require role === 'admin'
//
// HOW IT WORKS:
//   Runs AFTER ProtectedRoute (user is already authenticated).
//   If user is NOT admin → redirect to /dashboard (their home).
//   If they ARE admin    → render the child route.
//
// USAGE in App.jsx:
//   <Route element={<ProtectedRoute />}>
//     <Route element={<AdminRoute />}>
//       <Route path="/admin" element={<AdminDashboard />} />
//     </Route>
//   </Route>
// ─────────────────────────────────────────────────────────────────

const AdminRoute = () => {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent" />
            </div>
        );
    }

    return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
