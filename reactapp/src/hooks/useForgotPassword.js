import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API from '../apiConfig';

export const useForgotPassword = (navigate) => {
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        if (!formData.email) return toast.warn("Please enter your email");

        setLoading(true);
        try {
            const processedEmail = formData.email.trim().toLowerCase();
            await axios.post(API.CHECK_EMAIL, { email: processedEmail });

            setIsVerified(true);
            toast.info("Account verified! Enter your new password.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Email not found");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const { email, newPassword, confirmPassword } = formData;

        if (!newPassword || !confirmPassword) return toast.warn("Please fill all fields");
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            await axios.put(API.RESET_PASSWORD, {
                email: email.trim().toLowerCase(),
                newPassword
            });
            toast.success("Password Updated Successfully!");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not update password");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        isVerified,
        loading,
        handleInputChange,
        handleCheckEmail,
        handleUpdatePassword
    };
};