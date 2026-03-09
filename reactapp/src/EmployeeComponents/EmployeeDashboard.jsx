import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../apiConfig';
import { Calendar, Home, Clock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmployeeDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            // Fetch Top Card Stats
            const statsRes = await axios.get(API.EMPLOYEE_STATS, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // DEBUG: Check your console (F12) to see these keys!
            console.log("Stats from Backend:", statsRes.data);
            setStats(statsRes.data);

            // Fetch Recent Requests
            const [leaveRes, wfhRes] = await Promise.all([
                axios.get(`${API.GET_LEAVE_BY_USER}/${userId}?limit=5`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API.WFH}/${userId}?limit=5`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const combined = [
                ...(leaveRes.data.data || []).map(item => ({ ...item, requestType: 'Leave' })),
                ...(wfhRes.data.data || []).map(item => ({ ...item, requestType: 'WFH' }))
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

            setRecentRequests(combined);
        } catch (error) {
            console.error("Dashboard Error:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        </div>
    );

    // This section handles different backend naming conventions (e.g. leaveBalance vs balance)
    const cardData = [
        { 
            label: 'Leave Balance', 
            // Tries leaveBalance, then balance, then default to 0
            value: stats?.leaveBalance ?? stats?.balance ?? 0, 
            icon: <Calendar className="w-6 h-6 text-blue-600" />, 
            color: 'bg-blue-50' 
        },
        { 
            label: 'Pending Requests', 
            // Tries pendingRequests, then pendingCount, then default to 0
            value: stats?.pendingRequests ?? stats?.pendingCount ?? 0, 
            icon: <Clock className="w-6 h-6 text-yellow-600" />, 
            color: 'bg-yellow-50' 
        },
        { 
            label: 'WFH Days (Month)', 
            // Tries wfhDaysThisMonth, then wfhDays, then default to 0
            value: stats?.wfhDaysThisMonth ?? stats?.wfhDays ?? 0, 
            icon: <Home className="w-6 h-6 text-green-600" />, 
            color: 'bg-green-50' 
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cardData.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Recent Requests</h3>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase">Live Updates</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Dates</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentRequests.length > 0 ? (
                                    recentRequests.map((req) => (
                                        <tr key={req._id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800">
                                                    {req.requestType === 'Leave' ? req.leaveType : 'Work From Home'}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">{req.requestType}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                                                {new Date(req.startDate).toLocaleDateString('en-GB')} 
                                                {req.endDate && ` - ${new Date(req.endDate).toLocaleDateString('en-GB')}`}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                                    req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-20 text-center text-gray-300 text-sm italic">No recent activity.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-[#1C4587] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-[#FFD966]">WorkBuddy</h2>
                        <p className="text-blue-100 text-sm leading-relaxed mb-6">
                            "Success at work is a journey, and the first step is managing your tasks effectively."
                        </p>
                        <div className="w-12 h-1 bg-[#FFD966] rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"></div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;