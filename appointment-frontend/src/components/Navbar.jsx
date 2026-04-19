import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 w-full z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md bg-surface-container-low border-none">
            <nav className="flex items-center justify-between px-8 py-4 max-w-[1440px] mx-auto">
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

                <div className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        <>
                            <Link 
                                to="/login" 
                                className="hidden sm:flex items-center gap-2 px-4 py-2 text-secondary font-medium hover:bg-secondary/5 rounded-full transition-all"
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
                        <>
                            <span className="hidden sm:block text-sm text-slate-500 mr-2 font-medium">
                                {user?.name?.split(' ')[0]}
                            </span>
                            <button 
                                onClick={handleLogout}
                                className="text-secondary font-medium hover:bg-secondary/5 px-4 py-2 rounded-full transition-all text-sm"
                            >
                                Logout
                            </button>
                            <div className="flex gap-2 ml-2">
                                <Link to="/dashboard" className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-secondary">
                                    account_circle
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
