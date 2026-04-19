import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <>
            <main>
                {/* Hero Section: Editorial Depth */}
                <section className="relative min-h-[870px] flex items-center overflow-hidden px-8 py-20">
                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-8 z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-medium text-sm">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                Advanced Clinical Curation for Professionals
                            </div>
                            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.1]">
                                Precision Healthcare <br/>
                                <span className="text-blue-500 italic">Redefined.</span>
                            </h1>
                            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
                                MedX Clinical Curator v1.0 choreographs medical data into a sophisticated editorial experience. Reduce cognitive load and prioritize life-critical decisions.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link to="/register" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all flex items-center gap-3">
                                    Start Free Trial
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                                <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-surface-container-high transition-all">
                                    Watch Demo
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-5 relative">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-black/10 aspect-[4/5] bg-surface-container-low">
                                <img 
                                    alt="Modern healthcare professional" 
                                    className="w-full h-full object-cover" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMPGbFr68hq0QLuMnTxN3X5gcjd1bomOj5KBMzRa5j-STAH0fJYf1ntXOXDmZhtGeUJd3Qgo-tDJLOFQ4FpfB-cluyydQ8ozCkFuQp5LiR7439SDTajcffzB2IaWtrbtJPAPqn1oiW1iwmwIZzJ9zrhAC8iFMOZd756PFqsJpA3oQ7gMksrEvk65RAZGzacW1ohFFBUmIzmAIADTTDkOZ7eeT-rEMa7mPCtuSVdIC8KrNWQobdRbTW2bJuz9h5uHhGwjRI8LIAO5Y"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-2xl">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                                            <span className="material-symbols-outlined text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>health_metrics</span>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Vitals</div>
                                            <div className="text-lg font-bold text-on-surface">Stable Analysis</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Asymmetric Decorative Elements */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl -z-0"></div>
                            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl -z-0"></div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Services Overview */}
                <section className="py-24 px-8 bg-surface-container-low">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-16">
                            <h2 className="font-headline text-3xl md:text-4xl font-black tracking-tight mb-4">Core Ecosystem Services</h2>
                            <p className="text-on-surface-variant max-w-2xl font-body">Integrated clinical tools designed for seamless operation within the MedX Portal architecture.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Dashboard Module */}
                            <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/15 flex flex-col justify-between min-h-[400px]">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <span className="material-symbols-outlined text-4xl text-blue-500">dashboard</span>
                                        <h3 className="text-2xl font-bold font-headline">Clinical Dashboard</h3>
                                        <p className="text-on-surface-variant max-w-sm">Holistic overview of patient demographics, real-time vital tracking, and scheduled appointments in a single editorial view.</p>
                                    </div>
                                    <div className="hidden lg:block w-48 h-48 bg-surface-container rounded-lg overflow-hidden rotate-3 shadow-inner">
                                        <img className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsBoDcbI5jRno5Vc-NLG1H1TeRA_1vZYtnZdihbLzv1nhuuFgz-SLE_3v_75GnMRxZycerjr8P6QINf_N6btscc6Osw9d3fk36dboiCbNJUA7XCNXtOphqyrjoZlrFS1VVV8D0RZYfzgXm5bAMzREEpPS_sPlPvby2W7DuD3-zGj5y-ueRoPHVvf5z-vhkSE-ykqwaISeJmKu8n-Uhz7SMJA4Xwcs2GxIXS3MXXL_ZPNK5Kr9WscmOBkhBFU2ZORVHy69NPW6DWQk" alt="Dashboard" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-8">
                                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold tracking-wider">REAL-TIME</span>
                                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold tracking-wider">AI-DRIVEN</span>
                                </div>
                            </div>
                            
                            {/* Services Module */}
                            <div className="bg-blue-600 p-8 rounded-xl shadow-sm flex flex-col justify-between text-white">
                                <span className="material-symbols-outlined text-4xl text-primary-fixed">medical_services</span>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold font-headline">Service Management</h3>
                                    <p className="text-secondary-fixed-dim text-sm leading-relaxed">Customize clinical protocols and streamline service delivery across multiple departments.</p>
                                </div>
                                <Link to="/services" className="mt-8 text-primary-fixed flex items-center gap-2 font-bold hover:gap-4 transition-all">
                                    Learn More <span className="material-symbols-outlined">chevron_right</span>
                                </Link>
                            </div>

                            {/* Bookings Module */}
                            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/15">
                                <span className="material-symbols-outlined text-4xl text-blue-500 mb-6">calendar_month</span>
                                <h3 className="text-xl font-bold font-headline mb-3">Intelligent Bookings</h3>
                                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Smart scheduling that prevents clinician burnout through automated load balancing.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-xs font-semibold">
                                        <span className="material-symbols-outlined text-primary-fixed text-sm">check_circle</span> Instant Confirmation
                                    </li>
                                    <li className="flex items-center gap-2 text-xs font-semibold">
                                        <span className="material-symbols-outlined text-primary-fixed text-sm">check_circle</span> Patient Reminders
                                    </li>
                                </ul>
                            </div>

                            {/* Management Module */}
                            <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/15 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                                <div>
                                    <span className="material-symbols-outlined text-4xl text-blue-500 mb-4">settings_applications</span>
                                    <h3 className="text-xl font-bold font-headline mb-3">System Management</h3>
                                    <p className="text-on-surface-variant text-sm leading-relaxed">Enterprise-grade controls for clinical administrators and healthcare IT managers.</p>
                                </div>
                                <div className="relative h-32 bg-surface rounded-lg overflow-hidden">
                                    <img alt="System" className="w-full h-full object-cover opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBIVby-6gaPulQGEvAAenj-fSohLXADReIylO2nD6jHHE6bQ5tq1HDblQcQm4Tz65YUgTveBXGut0NC_rkr0PSNxNxRkoWI1hzFNGBebUR3O9fcCo2D0ffFNLcfpA7Ik66kji61bc5guYdsHUMMdWxnbJLV5tdy5lbJesUgtF3JnKJZhRkMkBX_RD3UYOCCQq3fplGvHMF3dxA4fNJTI_6_3k4yEKjcAeDR0GT6q6GY-eTeOBVQUlFXxYvKT0TkB8JxLZNotBkHSE" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-24 px-8 bg-surface">
                    <div className="max-w-4xl mx-auto text-center space-y-10">
                        <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">Ready to curate your clinical workflow?</h2>
                        <p className="text-lg text-on-surface-variant leading-relaxed px-4">
                            Join thousands of clinicians who have reclaimed their time and improved patient outcomes using MedX Portal.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link to="/register" className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-full font-headline font-black text-xl shadow-2xl shadow-slate-900/30 hover:scale-105 active:scale-95 transition-all text-center">
                                Create Your Portal
                            </Link>
                            <button className="w-full sm:w-auto px-10 py-5 rounded-full font-headline font-bold text-xl border border-outline/20 hover:bg-surface-container transition-all">
                                Contact Sales
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-8 pt-8 opacity-40 grayscale">
                            <span className="font-black text-2xl tracking-tighter">HEALTH.INC</span>
                            <span className="font-black text-2xl tracking-tighter">CLINIC.AI</span>
                            <span className="font-black text-2xl tracking-tighter">VITAL.SYS</span>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-[#f7f9fc] dark:bg-slate-900 w-full py-12 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8 font-inter text-xs tracking-wide">
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <span className="font-manrope font-bold text-slate-900 dark:text-white text-lg">MedX</span>
                        <p className="text-slate-400">© 2024 MedX Clinical Curator. All rights reserved.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a className="text-slate-400 hover:text-[#0058bd] underline-offset-4 hover:underline transition-all" href="#">Privacy Policy</a>
                        <a className="text-slate-400 hover:text-[#0058bd] underline-offset-4 hover:underline transition-all" href="#">Terms of Service</a>
                        <a className="text-slate-400 hover:text-[#0058bd] underline-offset-4 hover:underline transition-all" href="#">Contact Support</a>
                        <a className="text-slate-400 hover:text-[#0058bd] underline-offset-4 hover:underline transition-all" href="#">Clinical Standards</a>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-slate-500 hover:text-secondary cursor-pointer transition-colors">
                            <span className="material-symbols-outlined text-sm">language</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-slate-500 hover:text-secondary cursor-pointer transition-colors">
                            <span className="material-symbols-outlined text-sm">share</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default HomePage;
