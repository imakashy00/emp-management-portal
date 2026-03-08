import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, Home, Mail, Loader2, ShieldCheck } from 'lucide-react';
import API from '../apiConfig';
import { toast } from 'react-toastify';

const ManagerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API.DASHBOARD_STATS}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
    );

    const pieData = [
        { name: 'In Office', value: stats.pieChart.inOffice, color: '#10B981' },
        { name: 'On Leave', value: stats.pieChart.onLeave, color: '#EF4444' },
        { name: 'WFH Today', value: stats.pieChart.wfh, color: '#3B82F6' },
    ];

    const cards = [
        { label: "Total Employees", val: stats.summary.totalEmployees, icon: <Users size={20} />, col: "bg-blue-400" },
        { label: "Pending Leaves", val: stats.summary.pendingLeaves, icon: <FileText size={20} />, col: "bg-blue-400" },
        { label: "Pending WFH", val: stats.summary.pendingWfh, icon: <Home size={20} />, col: "bg-blue-400" },
        { label: "Total Invited", val: stats.summary.totalInvited, icon: <Mail size={20} />, col: "bg-blue-400" },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">

            {/* Top Grid: Stats Left (4/12), Chart Right (8/12) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

                {/* LEFT: Stacked Cards */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                    {cards.map((c, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center transition-transform hover:scale-[1.02]">
                            <div className={`${c.col} p-4 rounded-xl text-white shadow-lg mr-5`}>
                                {c.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
                                <p className="text-2xl font-black text-gray-800">{c.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: Attendance Chart */}
                <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Attendance Distribution</h2>
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">Live: Today</span>
                    </div>
                    <div className="h-[340px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={85}
                                    outerRadius={120}
                                    paddingAngle={10}
                                    dataKey="value"
                                    cx="50%"
                                    cy="45%"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" align="center" iconType="rect" iconSize={12} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* BOTTOM: Invited Managers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                        <ShieldCheck className="mr-2 text-blue-600" size={20} />
                        Manager Invitation Log
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-[11px] uppercase tracking-widest border-b border-gray-50">
                                <th className="px-8 py-5">Manager Email</th>
                                <th className="px-8 py-5">Security Token</th>
                                <th className="px-8 py-5 text-right">Invite Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.invitedManagers.map((invite) => (
                                <tr key={invite._id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-8 py-5 font-semibold text-gray-700">{invite.email}</td>
                                    <td className="px-8 py-5">
                                        <span className="font-mono text-[10px] bg-gray-100 text-gray-500 px-3 py-1.5 rounded-md border border-gray-200">
                                            {invite.token.substring(0, 24)}...
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right text-gray-400 text-sm">
                                        {new Date(invite.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </td>
                                </tr>
                            ))}
                            {stats.invitedManagers.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-8 py-10 text-center text-gray-400">No pending invitations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;