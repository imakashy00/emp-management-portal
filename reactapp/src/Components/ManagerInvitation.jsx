import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../apiConfig'; // Ensure INVITE_MANAGER is defined here
import Input from '../Components/Input';
import Button from '../Components/Button';

const ManagerInvitation = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!email) {
            return toast.error("Please enter an email address");
        }

        setLoading(true);
        try {
            // Data to send to backend
            const payload = { email };

            // Hitting the /invite-manager route
            // If API.INVITE_MANAGER is not defined, replace with '/api/invite-manager'
            await axios.post(API.INVITE_MANAGER, payload);

            toast.success("Invitation sent to manager successfully!");
            setEmail(''); // Reset form
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to send invitation";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-[#fff]">
            <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Professional Header */}
                <div className="bg-[#1C4587] p-6 text-center">
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                        Invite New Manager
                    </h2>
                    <div className="w-12 h-1 bg-[#FFD966] mx-auto mt-2 rounded-full"></div>
                    <p className="text-blue-100 text-[10px] mt-3 uppercase tracking-tighter opacity-80">
                        Enter the manager's email to grant them system access
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="group">
                        <Input
                            label="Manager Email Address"
                            name="email"
                            type="email"
                            placeholder="e.g. manager@company.com"
                            required
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            loading={loading}
                            className="flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            <span>Send Invitation Link</span>
                        </Button>
                    </div>

                    <p className="text-center text-[10px] text-gray-400 italic">
                        Managers will receive a registration link via this email.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ManagerInvitation;