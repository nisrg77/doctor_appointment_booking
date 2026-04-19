import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// ── Layout components ──────────────────────────────────────────
import Navbar from './components/Navbar';
import SidebarLayout from './components/SidebarLayout';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import AdminRoute from './components/AdminRoute';

// ── Pages ──────────────────────────────────────────────────────
import HomePage           from './pages/HomePage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import ServicesPage       from './pages/ServicesPage';
import DashboardPage      from './pages/DashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage       from './pages/NotFoundPage';

// ─────────────────────────────────────────────────────────────────
// App.jsx — single source of truth for ALL routing
//
// ROUTE STRUCTURE:
//
//   /               → HomePage (public)
//   /login          → LoginPage (public)
//   /register       → RegisterPage (public)
//   /services       → ServicesPage (public — browse catalog)
//   /dashboard      → DashboardPage (protected — user must be logged in)
//   /admin          → AdminDashboardPage (protected + admin role only)
//   *               → NotFoundPage (catch-all 404)
//
// WHY <Outlet /> pattern?
//   ProtectedRoute and AdminRoute use <Outlet /> so they don't need
//   to know what their children are — any nested route renders there.
//   This keeps guard logic completely separate from page components.
// ─────────────────────────────────────────────────────────────────

const App = () => {
    return (
        <BrowserRouter>
            {/*
                AuthProvider wraps everything — context is available
                to ALL components inside, including the Navbar and all pages
            */}
            <AuthProvider>


                <Routes>
                    {/* ── Landing/Public Pages (with Top Navbar) ── */}
                    <Route element={
                        <>
                            <Navbar />
                            <Outlet />
                        </>
                    }>
                        <Route path="/"         element={<HomePage />} />
                        
                        {/* ── Guest-only routes ── */}
                        <Route element={<GuestRoute />}>
                            <Route path="/login"    element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                        </Route>
                    </Route>

                    {/* ── Application Pages (with Sidebar Layout) ── */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<SidebarLayout />}>
                            <Route path="/services"  element={<ServicesPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />

                            {/* ── Admin-only routes ── */}
                            <Route element={<AdminRoute />}>
                                <Route path="/admin" element={<AdminDashboardPage />} />
                                <Route path="/admin_dashboard" element={<AdminDashboardPage />} />
                            </Route>
                        </Route>
                    </Route>

                    {/* ── Fallback ── */}
                    <Route path="/404"  element={<NotFoundPage />} />
                    <Route path="*"     element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
