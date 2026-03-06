import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API from '../apiConfig';

export const useSignup = (token, inviteEmail, navigate) => {
    const [formData, setFormData] = useState({
        userName: '', email: inviteEmail || '', mobile: '', password: '', confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            case 'userName': return !value ? "User Name is required" : "";
            case 'email': return !/\S+@\S+\.\S+/.test(value) ? "Invalid email format" : "";
            case 'mobile': return value.length !== 10 ? "Must be 10 digits" : "";
            case 'password': return value.length < 6 ? "Min 6 characters required" : "";
            case 'confirmPassword': return value !== formData.password ? "Passwords do not match" : "";
            default: return "";
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const err = validateField(key, formData[key]);
            if (err) newErrors[key] = err;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return toast.warn("Please fix validation errors");
        }

        setLoading(true);
        try {
            const { confirmPassword, ...submitData } = formData;
            const endpoint = token ? `${API.VERIFY_MANAGER}` : API.SIGNUP;
            const payload = token ? { ...submitData, token } : submitData;
            await axios.post(endpoint, payload);
            toast.success(token ? "Manager Registered!" : "Account Created!");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return { formData, errors, loading, handleInputChange, handleSubmit };
};