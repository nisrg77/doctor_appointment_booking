import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'services'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Appointments State
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, cancelled: 0, rejected: 0 });

    // Services State
    const [services, setServices] = useState([]);
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceFormData, setServiceFormData] = useState({ 
        name: '', description: '', duration: 30, price: 0, category: 'General' 
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        setError('');
        try {
            const [apptsRes, servsRes] = await Promise.all([
                api.get('/appointments/all'),
                api.get('/services')
            ]);
            setAppointments(apptsRes.data.data);
            if (apptsRes.data.stats) {
                setStats(apptsRes.data.stats);
            }
            setServices(servsRes.data.data);
        } catch (err) {
            setError('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    // ── Appointments Actions ──────────────────────────────────────
    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/appointments/${id}/status`, { status });
            fetchAllData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    // ── Services Actions ──────────────────────────────────────────
    const openAddService = () => {
        setEditingService(null);
        setServiceFormData({ name: '', description: '', duration: 30, price: 0, category: 'General' });
        setServiceModalOpen(true);
    };

    const openEditService = (service) => {
        setEditingService(service);
        setServiceFormData({
            name: service.name,
            description: service.description,
            duration: service.duration,
            price: service.price,
            category: service.category
        });
        setServiceModalOpen(true);
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingService) {
                await api.put(`/services/${editingService._id}`, serviceFormData);
            } else {
                await api.post('/services', serviceFormData);
            }
            setServiceModalOpen(false);
            fetchAllData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save service');
        }
    };

    const handleServiceDelete = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate this service?')) return;
        try {
            await api.delete(`/services/${id}`);
            fetchAllData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete service');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const totalBookings = stats.total || appointments.length;
    const pendingBookings = stats.pending || appointments.filter(a => a.status === 'pending').length;
    const urgentCases = appointments.filter(a => a.status === 'pending' && a.service?.category === 'Emergency').length || 0;

    return (
        <div className="p-8 max-w-7xl mx-auto w-full font-body">
            
            {/* Dashboard Header & Stats */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tighter font-headline text-on-surface mb-2">Master Administrator</h2>
                    <p className="text-on-surface-variant font-medium">Overview of clinical appointments and services.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-surface-container-high p-1 rounded-xl">
                        <button 
                            className={`px-4 py-2 text-sm rounded-lg transition-colors font-semibold ${activeTab === 'appointments' ? 'bg-surface-container-lowest text-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                            onClick={() => setActiveTab('appointments')}
                        >
                            Bookings
                        </button>
                        <button 
                            className={`px-4 py-2 text-sm rounded-lg transition-colors font-semibold ${activeTab === 'services' ? 'bg-surface-container-lowest text-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                            onClick={() => setActiveTab('services')}
                        >
                            Services
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 flex items-start gap-2 rounded-lg bg-error-container border border-error px-4 py-3 text-sm text-on-error-container">
                    <span className="material-symbols-outlined text-error">warning</span>
                    <span>{error}</span>
                </div>
            )}

            {/* ── Appointments View ────────────────────────────────────────── */}
            {activeTab === 'appointments' && (
                <>
                    {/* Metric Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-8 translate-x-8 transition-transform group-hover:scale-110"></div>
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Bookings</p>
                            <p className="text-3xl font-black font-headline text-on-surface">{totalBookings}</p>
                            <p className="text-xs text-blue-500 font-bold mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">trending_up</span> Live count
                            </p>
                        </div>
                        <div className="bg-surface-container-low p-6 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Pending Review</p>
                            <p className="text-3xl font-black font-headline text-on-surface">{pendingBookings}</p>
                            <p className="text-xs text-amber-600 font-bold mt-2 flex items-center gap-1">Awaiting action</p>
                        </div>
                        <div className="bg-surface-container-low p-6 rounded-xl">
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Active Services</p>
                            <p className="text-3xl font-black font-headline text-on-surface">{services.length}</p>
                            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-secondary h-full w-3/4 rounded-full"></div>
                            </div>
                        </div>
                        <div className="bg-surface-container-low p-6 rounded-xl border border-transparent">
                            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Urgency Cases</p>
                            <p className={`text-3xl font-black font-headline ${urgentCases > 0 ? 'text-error' : 'text-slate-400'}`}>{urgentCases < 10 ? `0${urgentCases}` : urgentCases}</p>
                            <p className={`text-xs font-medium mt-2 ${urgentCases > 0 ? 'text-error' : 'text-slate-400'}`}>Requires immediate attention</p>
                        </div>
                    </div>

                    {/* Main Data Table Container */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 overflow-hidden">
                        <div className="px-8 py-6 border-b border-surface-container flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="font-headline font-bold text-lg">Master Appointment List</h3>
                                <div className="h-6 w-[1px] bg-outline-variant"></div>
                                <span className="text-xs font-bold bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full">LIVE DATA</span>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50">
                                        <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Patient Details</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Service Type</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Schedule</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-low">
                                    {appointments.map(appt => (
                                        <tr key={appt._id} className="group hover:bg-surface-container-low/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold shrink-0">
                                                        {(appt.user?.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{appt.user?.name || 'Unknown User'}</p>
                                                        <p className="text-xs text-on-surface-variant">{appt.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">medical_services</span>
                                                    <span className="text-sm font-medium">{appt.service?.name || 'Deleted Service'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div>
                                                    <p className="text-sm font-bold">{formatDate(appt.date)}</p>
                                                    <p className="text-xs text-on-surface-variant">{appt.time}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                {appt.status === 'pending' && <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black uppercase tracking-tighter">Pending</span>}
                                                {appt.status === 'approved' && <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-tighter">Approved</span>}
                                                {appt.status === 'rejected' && <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-black uppercase tracking-tighter">Rejected</span>}
                                                {appt.status === 'cancelled' && <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-black uppercase tracking-tighter">Cancelled</span>}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {appt.status === 'pending' ? (
                                                    <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleStatusUpdate(appt._id, 'approved')}
                                                            className="bg-[#0058bd] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:shadow-md transition-all active:scale-95"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                                            className="bg-surface-container text-on-surface-variant text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-error-container hover:text-on-error-container transition-all active:scale-95"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium">Locked</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-12 text-center text-on-surface-variant">No appointments strictly matched.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ── Services View ────────────────────────────────────────────── */}
            {activeTab === 'services' && (
                <>
                    {/* Header Section for Services */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-on-surface font-headline mb-1">Service Catalog</h2>
                            <p className="text-on-surface-variant text-sm">Manage clinical service offerings and pricing.</p>
                        </div>
                        <button 
                            onClick={openAddService}
                            className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-transform flex items-center gap-2 text-sm"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Add New Service
                        </button>
                    </div>

                    <div className="grid grid-cols-12 gap-6 mb-8">
                        <div className="col-span-12 md:col-span-8 bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex flex-col justify-between overflow-hidden relative group">
                            <div className="z-10">
                                <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Platform Capacity</p>
                                <h3 className="text-3xl font-black text-on-surface font-headline">Active Services Overview</h3>
                            </div>
                            <div className="flex items-end justify-between mt-8 z-10">
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Offerings</p>
                                        <p className="text-2xl font-bold text-on-surface">{services.length}</p>
                                    </div>
                                    <div className="w-px h-10 bg-slate-100"></div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">System Status</p>
                                        <p className="text-2xl font-bold text-blue-500">Online</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
                        </div>
                    </div>

                    {/* Service Table Module */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border-none overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/30 border-b border-slate-100/50">
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50">
                                    {services.map(service => (
                                        <tr key={service._id} className="group hover:bg-surface-container-low/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div>
                                                    <p className="text-sm font-bold text-on-surface">{service.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{service.description}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-tighter">
                                                    {service.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-headline font-bold text-sm">${service.price}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{service.duration} Mins</div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-3 py-1 bg-[#d8e2ff] text-[#001a42] text-[10px] font-bold rounded-full">Active</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => openEditService(service)}
                                                        className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors" 
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleServiceDelete(service._id)}
                                                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors" 
                                                        title="Deactivate"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">block</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {services.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-12 text-center text-on-surface-variant">No active services running.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ── Service Form Modal ────────────────────────────── */}
            {serviceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-surface-container-lowest rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setServiceModalOpen(false)} 
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="flex flex-col items-center justify-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center mb-4 text-secondary">
                                <span className="material-symbols-outlined">post_add</span>
                            </div>
                            <h2 className="text-2xl font-extrabold text-on-surface mb-1 font-headline">
                                {editingService ? 'Edit Service' : 'New Service'}
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">
                                Configure clinical offering details.
                            </p>
                        </div>
                        
                        <form onSubmit={handleServiceSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Service Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium text-slate-700" 
                                    value={serviceFormData.name} 
                                    onChange={e => setServiceFormData({...serviceFormData, name: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Category</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium text-slate-700" 
                                    value={serviceFormData.category} 
                                    onChange={e => setServiceFormData({...serviceFormData, category: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Duration (mins)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        min="5" 
                                        className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium text-slate-700" 
                                        value={serviceFormData.duration} 
                                        onChange={e => setServiceFormData({...serviceFormData, duration: Number(e.target.value)})} 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Price ($)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        min="0" 
                                        className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium text-slate-700" 
                                        value={serviceFormData.price} 
                                        onChange={e => setServiceFormData({...serviceFormData, price: Number(e.target.value)})} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 pb-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Description</label>
                                <textarea 
                                    required 
                                    rows="3" 
                                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium text-slate-700 resize-none" 
                                    value={serviceFormData.description} 
                                    onChange={e => setServiceFormData({...serviceFormData, description: e.target.value})}
                                ></textarea>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setServiceModalOpen(false)} 
                                    className="flex-1 py-3 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-xl font-bold text-sm transition-colors font-headline"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md shadow-slate-900/20 hover:bg-slate-800 transition-colors font-headline"
                                >
                                    {editingService ? 'Save Changes' : 'Publish Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
