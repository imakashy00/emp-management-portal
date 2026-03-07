import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API from '../apiConfig';

export const useSignup = (token, inviteEmail, navigate) => {
    const [formData, setFormData] = useState({
        userName: '',
        email: inviteEmail || '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Sync email when inviteEmail changes 
    useEffect(() => {
        if (inviteEmail) {
            setFormData(prev => ({ ...prev, email: inviteEmail }));
        }
    }, [inviteEmail]);

    const validateField = (name, value, currentFormData) => {
        const dataToValidate = currentFormData || formData;

        switch (name) {
            case 'userName':
                return !value ? "Full Name is required" : "";
            case 'email':
                return !/\S+@\S+\.\S+/.test(value) ? "Invalid email format" : "";
            case 'mobile':
                return value.toString().length !== 10 ? "Must be 10 digits" : "";
            case 'password':
                return value.length < 6 ? "Min 6 characters required" : "";
            case 'confirmPassword':
                return value !== dataToValidate.password ? "Passwords do not match" : "";
            default: return "";
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newState = { ...prev, [name]: value };

            // Re-validate Confirm Password if Password changes
            if (name === 'password') {
                setErrors(errPrev => ({
                    ...errPrev,
                    password: validateField('password', value, newState),
                    confirmPassword: validateField('confirmPassword', newState.confirmPassword, newState)
                }));
            } else {
                setErrors(errPrev => ({ ...errPrev, [name]: validateField(name, value, newState) }));
            }

            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation check
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

            // const endpoint = token ? API.VERIFY_MANAGER : API.SIGNUP;

            const payload = token
                ? { ...submitData, token }
                : submitData;

            await axios.post(API.SIGNUP, payload);

            toast.success(token ? "Manager setup complete! Please login." : "Account created successfully!");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return { formData, errors, loading, handleInputChange, handleSubmit };
};
