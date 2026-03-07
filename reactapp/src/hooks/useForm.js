import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';

export const useForm = (type) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    startDate: '', endDate: '', reason: '', leaveType: 'Sick Leave', file: null
  });

  useEffect(() => {
    if (editData) {
      const formatDate = (d) => new Date(d).toISOString().split('T')[0];
      setFormData({
        startDate: formatDate(editData.startDate),
        endDate: formatDate(editData.endDate),
        reason: editData.reason,
        leaveType: editData.leaveType || 'Sick Leave',
        file: null
      });
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Field Validation
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      return toast.warn("Please fill all mandatory fields");
    }
    if (formData.reason.length < 10) {
      return toast.warn("Reason must be at least 10 characters");
    }

    setLoading(true);
    try {
      const employeeId = localStorage.getItem('userId');
      const isWFH = type === 'WFH';
      let payload, headers = {};

      if (isWFH) {
        payload = { ...formData, employeeId };
        headers = { 'Content-Type': 'application/json' };
      } else {
        payload = new FormData();
        payload.append('employeeId', employeeId);
        payload.append('startDate', formData.startDate);
        payload.append('endDate', formData.endDate);
        payload.append('reason', formData.reason);
        payload.append('leaveType', formData.leaveType);
        if (formData.file) payload.append('file', formData.file);
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      const baseUrl = isWFH ? API.ADD_WFH : API.ADD_LEAVE;
      const endpoint = editData ? `${baseUrl}/${editData._id}` : baseUrl;

      if (editData) await axios.put(endpoint, payload, { headers });
      else await axios.post(endpoint, payload, { headers });

      toast.success(`${type} Request Successful!`);
      navigate(isWFH ? '/wfh-history' : '/leave-history');
    } catch (err) {
      toast.error(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, errors, handleInputChange, handleSubmit, isEdit: !!editData };
};