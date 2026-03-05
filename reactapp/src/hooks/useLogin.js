import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_CONFIG from '../apiConfig';

export const useLogin = (navigate) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        if (name === 'email') {
            const emailRegex = /\S+@\S+\.\S+/;
            if (!value) return "Email is required";
            if (!emailRegex.test(value)) return "Invalid email format";
        }
        if (name === 'password') {
            if (!value) return "Password is required";
            if (value.length < 6) return "Min 6 characters required";
        }
        return "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const eErr = validateField('email', formData.email);
        const pErr = validateField('password', formData.password);

        if (eErr || pErr) {
            setErrors({ email: eErr, password: pErr });
            return toast.warn("Please fix validation errors");
        }

        setLoading(true);
        setServerError('');

        try {
            const response = await axios.post(API_CONFIG.LOGIN, {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            localStorage.clear();
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('userName', response.data.userName);

            toast.success("Login Successful! Welcome Back!!");
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || "Invalid Credentials";
            setServerError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return { formData, errors, serverError, loading, handleInputChange, handleLogin };
};