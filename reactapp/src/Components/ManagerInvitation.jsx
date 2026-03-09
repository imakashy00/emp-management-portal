
import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Send, Loader2, ShieldCheck } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig';

const ManagerInvitation = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            return toast.error("Email address is required");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = { email };

            await axios.post(API.INVITE_MANAGER, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Invitation sent successfully");
            setEmail('');
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Invitation failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto font-sans antialiased text-gray-900 pt-16">
            <Toaster position="top-center" />

            {/* Header Section */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
                    <ShieldCheck className="text-blue-300" size={24} />
                </div>
                <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Manager Invitation</h1>
                <p className="text-sm text-gray-500">Grant administrative access to new team leads</p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest ml-1">Recipient Email</p>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                            type="email"
                            placeholder="e.g. manager@company.com"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                        <Send size={16} />
                    )}
                    <span>{loading ? 'Processing...' : 'Send Access Link'}</span>
                </button>

                {/* Footer Note */}
                <div className="text-center pt-4">
                    <p className="text-[10px] text-gray-300 uppercase tracking-widest font-medium">
                        Secure Authorization Protocol
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ManagerInvitation;