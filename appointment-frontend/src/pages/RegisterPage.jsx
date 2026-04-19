import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [strength, setStrength] = useState({ score: 0, label: '', color: 'bg-slate-200' });
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Simple password strength checker
    const checkStrength = (pass) => {
        let score = 0;
        if (pass.length > 5) score += 1;
        if (pass.length > 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (pass.length === 0) return { score: 0, label: '', color: 'bg-surface-container-high' };
        if (score <= 2) return { score, label: 'Weak', color: 'bg-error' };
        if (score <= 4) return { score, label: 'Good', color: 'bg-blue-400' };
        return { score, label: 'Strong', color: 'bg-blue-600' };
    };

    useEffect(() => {
        setStrength(checkStrength(formData.password));
        if (formData.confirmPassword) {
            setPasswordsMatch(formData.password === formData.confirmPassword);
        } else {
            setPasswordsMatch(true); // Don't show error if empty
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            return setError('Please fill in all required fields.');
        }
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }

        setLoading(true);
        setError('');

        try {
            // Using auto-login flow (backend returns token & user)
            const res = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            const { token, user } = res.data;
            login(user, token);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden min-h-[calc(100vh-4rem)]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary-fixed-dim blur-[120px]"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]"></div>
            </div>

            {/* Registration Container */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-xl overflow-hidden bg-surface-container-lowest ambient-shadow relative z-10">
                
                {/* Side Visual/Information (Editorial Depth) */}
                <div className="hidden lg:flex lg:col-span-5 bg-on-secondary-fixed p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-6 leading-tight">
                            Precision Healthcare <br/>
                            <span className="text-blue-400">Starts with Data.</span>
                        </h1>
                        <p className="text-secondary-fixed/80 text-lg leading-relaxed max-w-sm">
                            Join the next generation of clinical curation. Manage patient outcomes with an editorial approach to medical intelligence.
                        </p>
                    </div>
                    <div className="space-y-8 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-blue-400">clinical_notes</span>
                            </div>
                            <div>
                                <h3 className="font-headline font-bold text-base">Intuitive Curation</h3>
                                <p className="text-sm text-secondary-fixed/60">Automated workflows designed for minimal cognitive load.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-blue-400">security</span>
                            </div>
                            <div>
                                <h3 className="font-headline font-bold text-base">Enterprise Security</h3>
                                <p className="text-sm text-secondary-fixed/60">HIPAA compliant architecture with end-to-end encryption.</p>
                            </div>
                        </div>
                    </div>
                    {/* Abstract Visual */}
                    <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/4 translate-y-1/4 opacity-10">
                        <img 
                            alt="Abstract medical pattern" 
                            className="w-full h-full object-cover rounded-full" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBcNdXvbUjvbpqkcsPAFOkWPsgq5IA1Z5SQtsGBkywVnl84CorRtYVVQ6D0V2lGMSyqtVvDoTRWlYn6NhfuayQVsG0CIEsIuWILu8WDUQWUvehYAAeigwnBCsUgxF7ABtCAo2L6-TIX6-oaZWbbmUagz4AlDoBE9V0pKq-8I9IR18n5HYAkfbwk1RAimIJtyRYTbXoYxbjy3hsW5oGbhQUU2-rPP_1wxhQGr1UgdYPWAMCbYhTSwrAhwNzOgA4uOovT_N0RUJBwaI"
                        />
                    </div>
                </div>

                {/* Form Side */}
                <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10">
                            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Create Account</h2>
                            <p className="text-on-surface-variant font-medium">Join MedX Clinical Curator today.</p>
                        </div>
                        
                        {error && (
                            <div className="mb-6 flex items-start gap-2 rounded-lg bg-error-container border border-error px-4 py-3 text-sm text-on-error-container">
                                <span className="material-symbols-outlined text-error">warning</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* Full Name */}
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2" htmlFor="name">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">person</span>
                                    <input 
                                        className="w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 border-surface-container-high focus:ring-0 focus:border-secondary transition-all text-on-surface placeholder:text-outline-variant/60" 
                                        id="name" 
                                        name="name" 
                                        placeholder="Dr. Julian Vane" 
                                        required 
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">mail</span>
                                    <input 
                                        className="w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 border-surface-container-high focus:ring-0 focus:border-secondary transition-all text-on-surface placeholder:text-outline-variant/60" 
                                        id="email" 
                                        name="email" 
                                        placeholder="curator@medx.com" 
                                        required 
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Password Fields Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">lock</span>
                                        <input 
                                            className="w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 border-surface-container-high focus:ring-0 focus:border-secondary transition-all text-on-surface placeholder:text-outline-variant/60" 
                                            id="password" 
                                            name="password" 
                                            placeholder="••••••••" 
                                            required 
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-2 text-xs">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-on-surface-variant font-medium">Strength:</span>
                                                <span className="font-bold uppercase tracking-wider" style={{ color: strength.score <= 2 ? '#ba1a1a' : strength.score <= 4 ? '#2563eb' : '#1d4ed8' }}>{strength.label}</span>
                                            </div>
                                            <div className="flex gap-1 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${(strength.score / 5) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2" htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="relative text-left">
                                        <span className={`material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 ${!passwordsMatch && formData.confirmPassword ? 'text-error' : 'text-outline-variant'} group-focus-within:${!passwordsMatch && formData.confirmPassword ? 'text-error' : 'text-secondary'} transition-colors`}>lock_reset</span>
                                        <input 
                                            className={`w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 ${!passwordsMatch && formData.confirmPassword ? 'border-error focus:border-error' : 'border-surface-container-high focus:border-secondary'} transition-all text-on-surface placeholder:text-outline-variant/60`}
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            placeholder="••••••••" 
                                            required 
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {!passwordsMatch && formData.confirmPassword && (
                                        <p className="mt-1 text-xs text-error font-medium">Passwords must match</p>
                                    )}
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-center gap-3 pt-2">
                                <input 
                                    className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20" 
                                    id="terms" 
                                    required 
                                    type="checkbox" 
                                />
                                <label className="text-sm text-on-surface-variant" htmlFor="terms">
                                    I agree to the <a className="text-secondary font-medium hover:underline" href="#">Terms of Service</a> and <a className="text-secondary font-medium hover:underline" href="#">Privacy Policy</a>.
                                </label>
                            </div>

                            {/* Sign Up Button */}
                            <button 
                                className="w-full py-4 bg-slate-900 text-white rounded-full font-headline font-bold text-lg shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed" 
                                type="submit"
                                disabled={loading || (!passwordsMatch && formData.confirmPassword.length > 0)}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="mt-8 text-center md:hidden">
                            <span className="text-on-surface-variant text-sm">Already have an account?</span>
                            <Link className="text-secondary font-semibold ml-1" to="/login">Log In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
