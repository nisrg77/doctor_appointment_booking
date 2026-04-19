import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [filterCategory, setFilterCategory] = useState('ALL');

    // Cancel modal state
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState('');

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            setAppointments(res.data.data);
        } catch (err) {
            setError('Failed to load appointments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // ── Cancel Handlers ──────────────────────────────────────────
    const handleCancelClick = (appointment) => {
        setSelectedAppointment(appointment);
        setCancelError('');
        setCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        setCancelLoading(true);
        setCancelError('');

        try {
            await api.put(`/appointments/${selectedAppointment._id}/cancel`);
            await fetchAppointments();
            setCancelModalOpen(false);
        } catch (err) {
            setCancelError(err.response?.data?.message || 'Failed to cancel appointment');
        } finally {
            setCancelLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // Find the next upcoming appointment (approved or pending)
    const upcomingAppt = appointments
        .filter(a => ['approved', 'pending'].includes(a.status))
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    const displayAppointments = filterCategory === 'ALL' 
        ? appointments 
        : appointments.filter(a => a.status.toUpperCase() === filterCategory);

    // Status Styling Helpers
    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
            case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
            case 'rejected': return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
            case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
            default: return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
        }
    };

    return (
        <div className="p-8 space-y-8 flex-1 w-full max-w-7xl mx-auto font-body">
            {/* Breadcrumbs & Headline */}
            <section>
                <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">
                    <span>Portal</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-secondary">My Appointments</span>
                </nav>
                <h2 className="font-headline text-4xl font-black text-on-surface tracking-tight">Clinical Appointments</h2>
            </section>

            {error && (
                <div className="mb-6 flex items-start gap-2 rounded-lg bg-error-container border border-error px-4 py-3 text-sm text-on-error-container">
                    <span className="material-symbols-outlined text-error">warning</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Summary Section (Upcoming) - Asymmetric Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
                    </div>
                    <div className="z-10 text-center md:text-left w-full">
                        {upcomingAppt ? (
                            <>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full mb-4">UPCOMING SESSION</span>
                                <h3 className="font-headline text-2xl font-bold text-slate-900 mb-2">{upcomingAppt.service?.name || 'Upcoming Appointment'}</h3>
                                <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                                    Your next appointment is scheduled. Please ensure you have any necessary requirements ready.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <div className="bg-surface-container-low px-4 py-2 rounded-lg">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Date</p>
                                        <p className="font-bold text-on-surface">{formatDate(upcomingAppt.date)}</p>
                                    </div>
                                    <div className="bg-surface-container-low px-4 py-2 rounded-lg">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Time</p>
                                        <p className="font-bold text-on-surface">{upcomingAppt.time}</p>
                                    </div>
                                    <div className="bg-surface-container-low px-4 py-2 rounded-lg">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                                        <p className="font-bold text-on-surface uppercase text-xs mt-1 text-blue-500">{upcomingAppt.status}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="font-headline text-2xl font-bold text-slate-900 mb-4">No upcoming bookings</h3>
                                <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">Schedule a new clinical service from our available catalog.</p>
                                <Link to="/services" className="inline-block bg-secondary text-white px-8 py-3 rounded-lg font-bold text-sm shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-transform">
                                    Book New Service
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-secondary-fixed text-on-secondary-fixed p-8 rounded-xl flex flex-col justify-between shadow-sm">
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-1">Analytics</p>
                        <h4 className="font-headline text-2xl font-bold">Patient Velocity</h4>
                    </div>
                    <div className="py-4 font-headline text-5xl font-black">
                        {appointments.length}
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-xs block font-medium opacity-70">Total Lifetime Appointments</span>
                        </div>
                        <span className="material-symbols-outlined text-4xl opacity-20">monitoring</span>
                    </div>
                </div>
            </section>

            {/* Booking History Table */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 gap-4">
                    <h3 className="font-headline text-lg font-bold text-on-surface">Booking History</h3>
                    <div className="flex gap-2">
                        {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setFilterCategory(tab)}
                                className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${filterCategory === tab ? 'bg-surface-container-low text-on-surface' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-lowest text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                                <th className="px-8 py-4">Service & Provider</th>
                                <th className="px-8 py-4">Date & Time</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-8 text-center text-sm text-slate-500">No appointments found.</td>
                                </tr>
                            ) : displayAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-8 text-center text-sm text-slate-500">No {filterCategory.toLowerCase()} appointments found.</td>
                                </tr>
                            ) : (
                                displayAppointments.map(appt => {
                                    const styles = getStatusStyle(appt.status);
                                    const isCancelledOrRejected = ['cancelled', 'rejected'].includes(appt.status);
                                    return (
                                        <tr key={appt._id} className={`hover:bg-surface-container-low transition-colors group ${isCancelledOrRejected ? 'opacity-60' : ''}`}>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-secondary shrink-0">
                                                        <span className="material-symbols-outlined">medical_services</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-on-surface text-sm">{appt.service?.name}</p>
                                                        <p className="text-xs text-slate-400">{appt.service?.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm">
                                                    <p className="font-medium text-on-surface">{formatDate(appt.date)}</p>
                                                    <p className="text-slate-400">{appt.time}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${styles.bg} ${styles.text}`}>
                                                    <span className={`w-1 h-1 rounded-full ${styles.dot} mr-1.5`}></span>
                                                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {['pending', 'approved'].includes(appt.status) ? (
                                                    <button 
                                                        onClick={() => handleCancelClick(appt)}
                                                        className="text-xs font-bold text-error hover:underline transition-opacity md:opacity-0 md:group-hover:opacity-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-medium">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Cancel Confirmation Modal */}
            {cancelModalOpen && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200 text-center relative">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <h3 className="font-headline text-lg font-bold text-slate-800 mb-2">Cancel Appointment?</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to cancel your appointment for <span className="font-semibold">{selectedAppointment.service?.name}</span>? This action cannot be undone.
                        </p>

                        {cancelError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 text-left flex gap-2">
                                {cancelError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setCancelModalOpen(false)}
                                className="flex-1 py-3 bg-surface-container border border-outline-variant text-on-surface rounded-xl font-bold text-sm transition-colors font-headline"
                                disabled={cancelLoading}
                            >
                                Keep it
                            </button>
                            <button 
                                onClick={handleConfirmCancel}
                                className="flex-1 py-3 bg-error text-on-error rounded-xl font-bold text-sm hover:opacity-90 transition-colors font-headline"
                                disabled={cancelLoading}
                            >
                                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
