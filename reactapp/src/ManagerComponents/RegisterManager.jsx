import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterManager = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!token || !email) {
            setMessage({ type: 'error', text: 'Invalid or missing invitation link.' });
        }
    }, [token, email]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match!' });
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register-manager', {
                name: formData.name,
                email: email,
                password: formData.password,
                token: token   
            });

            setMessage({ type: 'success', text: 'Account created! Redirecting...' });
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Registration failed.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        // Changed to h-screen and added overflow-hidden to block all scrolling
        <div className="h-screen w-full flex items-center justify-center bg-[#f4f7f6] p-4 overflow-hidden font-['Segoe_UI',sans-serif]">
            <div className="flex flex-col md:flex-row w-full max-w-[800px] bg-white rounded-xl overflow-hidden shadow-2xl">
                
                {/* Left Side: Branding */}
                <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-10 flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-2 text-white">WorkBuddy</h1>
                    <div className="w-10 h-1 bg-[#FFD966] mb-5"></div>
                    <p className="text-sm leading-relaxed opacity-90">
                        Welcome to the management team.
                    </p>
                </div>

                {/* Right Side: Form */}
                <div className="flex-[1.2] p-8 md:p-10 flex flex-col justify-center bg-white">
                    <h2 className="text-2xl font-bold text-center mb-1 text-[#333]">Manager Setup</h2>
                    <p className="text-center text-[10px] text-gray-400 mb-6 uppercase tracking-widest font-bold">
                        {email}
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="group">
                            <label className="text-[11px] text-gray-500 block mb-1 font-semibold uppercase tracking-wide">Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="Enter your full name" 
                                className="w-full py-2 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] transition-colors text-[14px]"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="text-[11px] text-gray-500 block mb-1 font-semibold uppercase tracking-wide">Set Password</label>
                            <input 
                                type="password" 
                                name="password"
                                placeholder="••••••••" 
                                className="w-full py-2 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] transition-colors text-[14px]"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="text-[11px] text-gray-500 block mb-1 font-semibold uppercase tracking-wide">Confirm Password</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                placeholder="••••••••" 
                                className="w-full py-2 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] transition-colors text-[14px]"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {message.text && (
                            <p className={`${message.type === 'error' ? 'text-[#CC0000]' : 'text-green-600'} text-[11px] mt-2 italic font-bold text-center`}>
                                {message.text}
                            </p>
                        )}
                        
                        <button 
                            type="submit" 
                            disabled={loading || !token}
                            className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded-lg font-bold mt-2 transition-colors cursor-pointer disabled:bg-gray-400 uppercase text-xs tracking-wider"
                        >
                            {loading ? 'Processing...' : 'Complete Registration'}
                        </button>
                        
                        <p className="text-center mt-4 text-[13px] text-gray-600">
                            Already registered?{' '}
                            <span 
                                className="text-[#3C78D8] font-bold cursor-pointer hover:underline" 
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterManager;