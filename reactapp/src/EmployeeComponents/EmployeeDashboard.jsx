import React, { useEffect, useState } from 'react';
import { Calendar, Home, Clock, Plus } from 'lucide-react'; // Optional: Use lucide-react for icons

const EmployeeDashboard = () => {
    // Mock data - in real app, fetch this from an API like /api/users/me-stats
    const stats = [
        { label: 'Leave Balance', value: 25, icon: <Calendar className="w-6 h-6 text-blue-600" />, color: 'bg-blue-50' },
        { label: 'Pending Requests', value: 2, icon: <Clock className="w-6 h-6 text-yellow-600" />, color: 'bg-yellow-50' },
        { label: 'WFH Days (Month)', value: 4, icon: <Home className="w-6 h-6 text-green-600" />, color: 'bg-green-50' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
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

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="font-bold text-gray-800">Recent Requests</h3>
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
                                {/* Sample Row */}
                                <tr>
                                    <td className="px-6 py-4 font-medium">Sick Leave</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">Oct 12 - Oct 14</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Approved</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 font-medium">WFH Request</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">Oct 20</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Pending</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Motivational Sidebar */}
                <div className="bg-[#1C4587] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-[#FFD966]">WorkBuddy</h2>
                        <p className="text-blue-100 text-sm leading-relaxed mb-6">
                            "Success at work is a journey, and the first step is managing your tasks effectively."
                        </p>
                        <div className="w-12 h-1 bg-[#FFD966] rounded-full"></div>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"></div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;