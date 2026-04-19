import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarLayout = () => {
    const { isAuthenticated, logout, user, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-surface-container-lowest overflow-hidden font-body">
            {/* Left Sidebar */}
            <aside className="w-[100px] bg-[#021124] text-white flex flex-col items-center py-8 z-10 shrink-0 border-r border-[#021124]/10 shadow-[4px_0_24px_rgba(2,17,36,0.1)]">
                {/* Logo Area */}
                <div className="mb-12">
                    <span className="material-symbols-outlined text-4xl text-blue-400">medical_services</span>
                </div>

                {/* Primary Navigation */}
                <nav className="flex flex-col gap-6 flex-grow">
                    <Link 
                        to="/" 
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive('/') ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        title="Home"
                    >
                        <span className="material-symbols-outlined text-[28px]">home</span>
                    </Link>
                    
                    <Link 
                        to="/services" 
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${(isActive('/services') || isActive('/dashboard')) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        title="Appointments"
                    >
                        <span className="material-symbols-outlined text-[28px]">calendar_month</span>
                    </Link>

                    {isAdmin && (
                        <Link 
                            to="/admin" 
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isActive('/admin') ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            title="Admin Dashboard"
                        >
                            <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
                        </Link>
                    )}

                    <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
                        title="Health Records"
                    >
                        <span className="material-symbols-outlined text-[28px]">favorite</span>
                    </div>
                    
                    <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
                        title="Settings"
                    >
                        <span className="material-symbols-outlined text-[28px]">settings</span>
                    </div>

                    <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
                        title="Help"
                    >
                        <span className="material-symbols-outlined text-[28px]">info</span>
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto">
                    {isAuthenticated ? (
                        <button 
                            onClick={handleLogout}
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all group"
                            title="Logout"
                        >
                            <span className="material-symbols-outlined text-[28px] group-hover:-translate-x-1 transition-transform">logout</span>
                        </button>
                    ) : (
                        <Link 
                            to="/login"
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-green-400/10 transition-all"
                            title="Login"
                        >
                            <span className="material-symbols-outlined text-[28px]">login</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content Viewport */}
            <main className="flex-1 overflow-y-auto bg-[#F4F7FA]">
                <Outlet />
            </main>
        </div>
    );
};

export default SidebarLayout;
