import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
const API='sdfjsd'
export const useForm = (type) => {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        attachment: null, // Stores the File object
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, files, type } = e.target;

        // Special handling for file uploads
        if (type === 'file') {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0], // Store the actual file object
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        // 1. Check basic required fields
        if (!formData.startDate || !formData.endDate || !formData.reason) {
            alert("Please fill in all required fields.");
            return false;
        }

        // 2. Validate Dates (End date cannot be before Start date)
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            alert("End date cannot be earlier than start date.");
            return false;
        }

        // 3. Mandatory File Check for Sick Leave
        if (type === 'SICK_LEAVE' && !formData.attachment) {
            alert("A medical certificate is mandatory for Sick Leave requests.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Logic for sending data to your API
            // Since we have a file, we use FormData instead of a JSON object
            const submissionData = new FormData();
            submissionData.append('type', type);
            submissionData.append('startDate', formData.startDate);
            submissionData.append('endDate', formData.endDate);
            submissionData.append('reason', formData.reason);

            if (formData.attachment) {
                submissionData.append('attachment', formData.attachment);
            }

            const endpoint = type === 'SICK_LEAVE' ? API.ADD_SICK_LEAVE : API.ADD_WFH;

            // Simulate API Call
            await axios.post(endpoint, submissionData);

            // alert(`${requestType === 'SICK_LEAVE' ? 'Sick Leave' : 'WFH'} request submitted successfully!`);

            toast.success(`${type === 'SICK_LEAVE' ? 'Sick Leave' : 'WFH'} Request Submitted!`);
            setFormData({ startDate: '', endDate: '', reason: '', attachment: null });

        } catch (err) {
            setError("Failed to submit request. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        error,
        handleInputChange,
        handleSubmit,
    };
};