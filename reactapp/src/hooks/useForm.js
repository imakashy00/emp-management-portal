import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';

export const useForm = (type) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detect if we are in Edit Mode (passed via state from History table)
  const editData = location.state?.editData;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'Sick Leave',
    file: null
  });

  // Pre-fill form if editing (Ref: Page 34 & 41)
  useEffect(() => {
    if (editData) {
      const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];
      setFormData({
        startDate: formatDate(editData.startDate),
        endDate: formatDate(editData.endDate),
        reason: editData.reason,
        leaveType: editData.leaveType || 'Sick Leave',
        file: null // Files aren't pre-filled for security
      });
    }
  }, [editData]);

  // Real-time validation logic
  const validate = () => {
    let tempErrors = {};
    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(formData.startDate).getTime();
    const end = new Date(formData.endDate).getTime();

    if (!formData.startDate) tempErrors.startDate = "Required";
    else if (start < today && !editData) tempErrors.startDate = "Date cannot be in past";

    if (!formData.endDate) tempErrors.endDate = "Required";
    else if (end < start) tempErrors.endDate = "Cannot be before start date";

    if (!formData.reason) tempErrors.reason = "Reason is required";
    else if (formData.reason.length < 10) tempErrors.reason = "Minimum 10 characters required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    // Clear error for this field as user types
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.warn("Please fix validation errors");

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const employeeId = localStorage.getItem('userId');
      const isWFH = type === 'WFH';

      if (!token || !employeeId) {
        toast.error("Session expired. Please log in.");
        return navigate('/login');
      }

      // Logic: Selection of correct payload and headers
      let payload;
      let contentType = 'application/json';

      if (isWFH) {
        // WFH uses standard JSON
        payload = { ...formData, employeeId };
      } else {
        // LEAVE uses FormData for file uploads
        payload = new FormData();
        payload.append('employeeId', employeeId);
        payload.append('startDate', formData.startDate);
        payload.append('endDate', formData.endDate);
        payload.append('reason', formData.reason);
        payload.append('leaveType', formData.leaveType);
        if (formData.file) payload.append('file', formData.file);
        contentType = 'multipart/form-data';
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // REQUIRED for backend verifyJWT
          'Content-Type': contentType
        }
      };

      // URL Selection based on API Config keys
      const baseUrl = isWFH ? API.ADD_WFH : API.ADD_LEAVE;
      const endpoint = editData ? `${baseUrl}/${editData._id}` : baseUrl;
      const method = editData ? 'put' : 'post';

      // API Call
      await axios[method](endpoint, payload, config);

      toast.success(`${type} Request ${editData ? 'Updated' : 'Submitted'} Successfully!`);
      
      // Navigate back to history
      navigate(isWFH ? '/wfh-history' : '/leave-history');
      
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Operation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, errors, handleInputChange, handleSubmit, isEdit: !!editData };
};