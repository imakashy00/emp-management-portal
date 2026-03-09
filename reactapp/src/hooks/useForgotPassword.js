
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API from '../apiConfig';

export const useForgotPassword = (navigate) => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '', // Added OTP
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckEmail = async () => {
        if (!formData.email) {
            toast.warn("Please enter your email");
            return false;
        }

        setLoading(true);
        try {
            const processedEmail = formData.email.trim().toLowerCase();
            await axios.post(API.CHECK_EMAIL, { email: processedEmail });
            toast.info("OTP sent! Please check your email.");
            setLoading(false);
            return true; // Return success to move to next step
        } catch (err) {
            toast.error(err.response?.data?.message || "Email not found");
            setLoading(false);
            return false;
        }
    };

    const handleUpdatePassword = async () => {
        const { email, otp, newPassword, confirmPassword } = formData;

        if (!otp) { toast.warn("Please enter the 6-digit code"); return; }
        if (!newPassword || !confirmPassword) { toast.warn("Please fill all fields"); return; }
        if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }

        setLoading(true);
        try {
            await axios.put(API.RESET_PASSWORD, {
                email: email.trim().toLowerCase(),
                otp,
                newPassword
            });
            toast.success("Password Updated Successfully!");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP or request failed");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        handleInputChange,
        handleCheckEmail,
        handleUpdatePassword
    };
};