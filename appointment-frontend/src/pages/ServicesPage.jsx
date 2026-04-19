import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// ── Mock Data for Doctors (Option A) ──────────────────────────
const MOCK_DOCTORS = [
    { 
        id: 1, 
        name: 'Dr. Liza Martin', 
        role: 'Cardiologist', 
        rating: 5.0, 
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200', 
        bio: 'Dr. Liza Martin is a renowned cardiologist with over 15 years of experience in leading university medical schools. She specializes in non-invasive cardiology and clinical research. Liza graduated with honors from Stanford University and has since become a leading specialist in echocardiography.',
        location: '123 Main Street, New York, USA'
    },
    { 
        id: 2, 
        name: 'Dr. Robert Wilson', 
        role: 'Pediatrician', 
        rating: 4.8, 
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200', 
        bio: 'Dr. Robert Wilson is a dedicated pediatrician focused on child development and preventive care. He has worked in multiple international clinics helping children across various demographics.',
        location: '456 Healthcare Ave, New York, USA'
    },
    { 
        id: 3, 
        name: 'Dr. Sarah Chen', 
        role: 'Ophthalmologist', 
        rating: 4.9, 
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200', 
        bio: 'Dr. Sarah Chen is an eye specialist with a passion for restorative vision surgery. She has performed over 1,000 successful procedures.',
        location: '789 Vision Blvd, New York, USA'
    }
];

const TIME_SLOTS = [
    '08:30', '09:30', '10:30', '11:30', '12:30', 
    '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'
];

const CATEGORY_ICONS = {
    'Pediatrics': 'child_care',
    'Cardiology': 'favorite',
    'Ophthalmology': 'visibility',
    'Traumatology': 'healing',
    'Psychology': 'psychology',
    'Endocrinology': 'medical_services',
    'Oncology': 'pill',
    'Pulmonology': 'air',
    'Orthopedics': 'blind',
    'Radiology': 'radiology',
    'Neonatal': 'baby_changing_station',
    'Echo': 'ecg',
    'Mental Wellness': 'self_care'
};

const ServicesPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDoctor, setSelectedDoctor] = useState(MOCK_DOCTORS[0]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [baseDate, setBaseDate] = useState(new Date()); // The first day of the 7-day strip
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');

    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/services');
                setServices(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedServiceId(res.data.data[0]._id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const categories = useMemo(() => {
        const cats = services.map(s => s.category);
        return ['All', ...new Set(cats)];
    }, [services]);

    const filteredServices = useMemo(() => {
        return selectedCategory === 'All' 
            ? services 
            : services.filter(s => s.category === selectedCategory);
    }, [services, selectedCategory]);

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const handleBooking = async () => {
        if (!selectedTime || !selectedServiceId) {
            setMessage({ text: 'Please select a service and a time slot.', type: 'error' });
            return;
        }

        setBookingLoading(true);
        setMessage({ text: '', type: '' });

        try {
            await api.post('/appointments', {
                serviceId: selectedServiceId,
                date: selectedDate.toISOString(),
                time: selectedTime,
                notes: `Booked with ${selectedDoctor.name} (Visual Mock)`
            });
            setMessage({ text: 'Appointment booked successfully!', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Booking failed.', type: 'error' });
        } finally {
            setBookingLoading(false);
        }
    };

    // Helper to generate the 7-day strip relative to baseDate
    const dateStrip = useMemo(() => {
        const strip = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() + i);
            strip.push(d);
        }
        return strip;
    }, [baseDate]);

    const navigateWeek = (direction) => {
        const newBase = new Date(baseDate);
        newBase.setDate(baseDate.getDate() + (direction * 7));
        
        // Prevent going into the past (before today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (newBase < today && direction < 0) {
            setBaseDate(today);
        } else {
            setBaseDate(newBase);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-[#f4f7fa] overflow-hidden">
            {/* Main Center Column (70%) */}
            <div className="flex-1 overflow-y-auto px-10 py-8 scrollbar-hide">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Make appointment</h1>

                {/* Section 1: Choose category */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-slate-500 mb-4">Choose category</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === cat ? 'bg-blue-100 text-blue-600 border-2 border-blue-400 shadow-sm' : 'bg-white text-slate-400 hover:bg-slate-50 shadow-sm'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {CATEGORY_ICONS[cat] || 'medical_services'}
                                </span>
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Section 2: Choose Service (Dynamic from Backend) */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-slate-500 mb-4">Choose service</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                        {filteredServices.map(service => (
                            <div
                                key={service._id}
                                onClick={() => setSelectedServiceId(service._id)}
                                className={`min-w-[280px] p-6 rounded-3xl cursor-pointer transition-all border-2 ${selectedServiceId === service._id ? 'bg-white border-blue-400 shadow-xl' : 'bg-white border-transparent shadow-sm hover:shadow-md'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-xl ${selectedServiceId === service._id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <span className="material-symbols-outlined">medical_services</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{service.category}</div>
                                        <div className="text-lg font-black text-slate-800">${service.price}</div>
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-800 truncate">{service.name}</h3>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{service.description}</p>
                                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-blue-500">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    {service.duration} MIN
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Choose doctor (Mock) */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-slate-500 mb-4">Choose doctor</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                        {MOCK_DOCTORS.map(doc => (
                            <div
                                key={doc.id}
                                onClick={() => setSelectedDoctor(doc)}
                                className={`min-w-[300px] p-4 rounded-3xl flex items-center gap-4 cursor-pointer transition-all border-2 ${selectedDoctor.id === doc.id ? 'bg-white border-blue-400 shadow-xl scale-105' : 'bg-white border-transparent shadow-sm hover:shadow-md'}`}
                            >
                                <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 text-sm">{doc.name}</h3>
                                    <p className="text-xs text-slate-400">{doc.role}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[14px] text-blue-500 fill-blue-500">star</span>
                                        <span className="text-[12px] font-bold text-slate-800">{doc.rating}</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">more_vert</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 4: Choose date and time */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-slate-500">Choose date and time</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => navigateWeek(-1)}
                                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-blue-500 shadow-sm transition-colors disabled:opacity-30"
                                    disabled={baseDate <= new Date().setHours(0,0,0,0)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <button 
                                    onClick={() => navigateWeek(1)}
                                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-blue-500 shadow-sm transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm text-sm font-bold text-slate-600 min-w-[140px] justify-center">
                                 <span className="material-symbols-outlined text-sm text-blue-500">calendar_today</span>
                                 {baseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Date Strip */}
                    <div className="flex justify-between mb-8 bg-white p-2 rounded-[2rem] shadow-sm">
                        {dateStrip.map(date => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => handleDateClick(date)}
                                    className={`flex flex-col items-center justify-center w-16 h-20 rounded-3xl transition-all ${isSelected ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <span className="text-xs uppercase font-bold mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-xl font-black">{date.getDate()}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Time Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                        {TIME_SLOTS.map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedTime(t)}
                                className={`py-3 rounded-2xl text-sm font-bold transition-all ${selectedTime === t ? 'bg-blue-100 text-blue-600 border-2 border-blue-400' : 'bg-white text-slate-400 border-2 border-transparent shadow-sm hover:shadow-md'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Booking Sticky Action */}
                <div className="sticky bottom-0 bg-[#f4f7fa]/80 backdrop-blur-md pt-4 pb-8 border-t border-slate-200">
                    <div className="bg-[#f0f8ff] border border-blue-100 rounded-3xl p-2 flex items-center justify-between shadow-lg shadow-blue-400/5">
                        <div className="px-6">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">Selected Slot</span>
                            <span className="text-lg font-black text-slate-800">
                                {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} | {selectedTime || '--:--'}
                            </span>
                        </div>
                        <button 
                            disabled={bookingLoading || !selectedTime}
                            onClick={handleBooking}
                            className="bg-blue-400 hover:bg-blue-500 text-slate-900 px-12 py-4 rounded-[1.5rem] font-black text-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                            {bookingLoading ? 'Booking...' : 'Book'}
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`mt-4 p-4 rounded-xl text-center font-bold text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            {/* Right Panel (30%) */}
            <div className="w-[380px] bg-white border-l border-slate-100 overflow-y-auto hidden xl:block p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <img 
                            src={selectedDoctor.image} 
                            alt={selectedDoctor.name} 
                            className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-slate-50 shadow-xl"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-green-400 w-8 h-8 rounded-full border-4 border-white"></div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-1">{selectedDoctor.name}</h2>
                    <p className="text-slate-400 font-bold text-sm mb-6">{selectedDoctor.role}</p>

                    <div className="flex gap-4 mb-8">
                        <button className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                        </button>
                        <button className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">call</span>
                        </button>
                        <button className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">videocam</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Biography</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {selectedDoctor.bio} <span className="text-blue-500 font-bold cursor-pointer">Read more</span>
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Location</h3>
                        <div className="relative rounded-3xl overflow-hidden h-48 bg-slate-100 border border-slate-100 shadow-inner group">
                            <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600&h=400" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-500 text-5xl">location_on</span>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-4 flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm">map</span>
                             {selectedDoctor.location}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
