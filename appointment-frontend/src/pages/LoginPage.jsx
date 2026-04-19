import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', formData);
            const { token, user } = res.data;
            login(user, token);
            navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-5xl flex flex-col md:flex-row bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-outline-variant/10">
                
                {/* Branding/Visual Sidebar */}
                <div className="hidden md:flex md:w-5/12 bg-on-secondary-fixed flex-col justify-between p-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                            </div>
                            <span className="font-headline font-black text-2xl text-white tracking-tighter">MedX</span>
                        </div>
                        <h1 className="font-headline text-4xl font-extrabold text-white leading-tight mb-6">
                            Clinical Precision.<br/>
                            <span className="text-primary-fixed">Editorial Depth.</span>
                        </h1>
                        <p className="text-secondary-fixed-dim text-lg leading-relaxed font-light">
                            Curating medical data into actionable insights with the next generation of clinical intelligence.
                        </p>
                    </div>
                    <div className="relative z-10">
                        <div className="flex flex-col gap-4">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-primary-fixed text-sm">verified</span>
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">System Status</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary-fixed"></div>
                                    <span className="text-sm text-secondary-fixed-dim">All clinical nodes operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 -mb-12 -mr-12">
                        <img 
                            className="w-full h-full object-cover rounded-full" 
                            alt="Macro close-up of high-tech glass medical laboratory equipment with blue and lime green light refractions" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDghKCO8fj7uqGM-wZUCFGuvE-_GNPvf64AqJ7W9WmFgLAa-NUoqiJXwTeaGFr_seXWtY-oR-3WKTTZJ9dL8Jldmm_KjkEAxgDoJ8XXUo2F8UNOO77rfXCgWBPM3p6rP1S0fkQT4BVoFXrhJvrK92C2C22-P2FWC0gxPtUjfgU--EksTyZWGBGFS3y91YIgvyLuXOF0Ce9SP7XBFalca9HIuYwBiMdRTByrRNQpnYrIlUYRGYhDkZsUDBFkAnqwDCkj9zU4yUKkA0k"
                        />
                    </div>
                </div>

                {/* Login Form Section */}
                <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
                        <p className="text-on-surface-variant font-body">Please enter your credentials to access the MedX Portal.</p>
                    </div>
                    
                    {error && (
                        <div className="mb-6 flex items-start gap-2 rounded-lg bg-error-container border border-error px-4 py-3 text-sm text-on-error-container">
                            <span className="material-symbols-outlined text-error">warning</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-on-surface-variant font-label" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-outline text-xl">alternate_email</span>
                                </div>
                                <input 
                                    className="block w-full pl-11 pr-4 py-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all duration-200 text-on-surface placeholder-outline font-body" 
                                    id="email" 
                                    name="email" 
                                    placeholder="clinician@medx.com" 
                                    required 
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-secondary transition-all duration-300 peer-focus:w-full"></div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-semibold text-on-surface-variant font-label" htmlFor="password">Password</label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-outline text-xl">lock</span>
                                </div>
                                <input 
                                    className="block w-full pl-11 pr-12 py-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all duration-200 text-on-surface placeholder-outline font-body" 
                                    id="password" 
                                    name="password" 
                                    placeholder="••••••••••••" 
                                    required 
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button 
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors" 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                className="w-full py-4 px-6 rounded-full bg-slate-900 text-white font-bold text-lg shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 font-headline" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Authenticating...' : 'Login to Portal'}
                                {!loading && <span className="material-symbols-outlined text-xl">login</span>}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 font-body">
                        <p className="text-sm text-on-surface-variant">New to the Clinical Curator?</p>
                        <Link to="/register" className="px-6 py-2 rounded-full border border-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors">
                            Request Access
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
