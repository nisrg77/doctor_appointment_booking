import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100">
            <nav className="flex items-center justify-between px-6 py-4 max-w-[1440px] mx-auto relative">
                <div className="flex items-center gap-8">
                    <Link to="/" className="font-headline font-black text-[#0058bd] text-xl">
                        MedX
                    </Link>
                    <div className="hidden md:flex gap-6 items-center">
                        <Link 
                            to="/services" 
                            className={`font-body text-base transition-colors ${isActive('/services') ? 'text-[#0058bd] font-semibold' : 'text-slate-500 hover:text-[#0058bd]'}`}
                        >
                            Services
                        </Link>
                        {isAuthenticated && (
                            <Link 
                                to="/dashboard" 
                                className={`font-body text-base transition-colors ${isActive('/dashboard') ? 'text-[#0058bd] font-semibold' : 'text-slate-500 hover:text-[#0058bd]'}`}
                            >
                                Dashboard
                            </Link>
                        )}
                        {isAdmin && (
                            <Link 
                                to="/admin" 
                                className={`font-body text-base transition-colors ${isActive('/admin') ? 'text-[#0058bd] font-semibold' : 'text-slate-500 hover:text-[#0058bd]'}`}
                            >
                                Admin Panel
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 text-secondary font-medium hover:bg-secondary/5 rounded-full transition-all"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold tracking-tight shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all text-sm"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                                    {user?.name?.split(' ')[0]}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="text-secondary font-medium hover:bg-secondary/5 px-4 py-2 rounded-full transition-all text-sm"
                                >
                                    Logout
                                </button>
                                <Link to="/dashboard" className="material-symbols-outlined text-slate-500 hover:text-secondary">
                                    account_circle
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Hamburger Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined text-slate-600">
                            {isMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 md:hidden z-50 animate-in slide-in-from-top-4 duration-200">
                        <div className="flex flex-col gap-4">
                            <Link 
                                to="/services" 
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-lg font-bold ${isActive('/services') ? 'text-primary' : 'text-slate-600'}`}
                            >
                                Services
                            </Link>
                            {isAuthenticated && (
                                <Link 
                                    to="/dashboard" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-lg font-bold ${isActive('/dashboard') ? 'text-primary' : 'text-slate-600'}`}
                                >
                                    Dashboard
                                </Link>
                            )}
                            <div className="h-px bg-slate-100 my-2" />
                            {!isAuthenticated ? (
                                <div className="flex flex-col gap-3">
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-3 text-center font-bold text-slate-600 rounded-xl bg-slate-50"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-3 text-center font-bold text-white rounded-xl bg-slate-900 shadow-lg"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
                                        <span className="material-symbols-outlined text-slate-400">account_circle</span>
                                        <span className="font-bold text-slate-700">{user?.name}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full py-3 text-center font-bold text-red-500 rounded-xl bg-red-50"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
