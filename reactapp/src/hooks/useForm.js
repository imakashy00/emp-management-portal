// src/hooks/useForm.js - FULL UPDATED CODE
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
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'Sick Leave',
    attachment: null
  });

  useEffect(() => {
    if (editData) {
      const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];
      setFormData({
        startDate: formatDate(editData.startDate),
        endDate: formatDate(editData.endDate),
        reason: editData.reason,
        leaveType: editData.leaveType || 'Sick Leave',
        attachment: null
      });
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get ID - WE SEND BOTH KEYS TO BE SAFE
      const storedId = localStorage.getItem('userId');
      
      if (!storedId) {
        toast.error("Session expired. Please log in again.");
        return navigate('/login');
      }

      const isWFH = type === 'WFH';
      let payload;
      let headers = {};

      if (isWFH) {
        // --- WFH PAYLOAD (JSON) ---
        payload = {
          employeeId: storedId, // Explicitly match your Mongoose Model
          userId: storedId,     // Extra safety for the controller
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason
        };
        headers = { 'Content-Type': 'application/json' };
      } else {
        // --- LEAVE PAYLOAD (FormData) ---
        payload = new FormData();
        payload.append('employeeId', storedId);
        payload.append('userId', storedId);
        payload.append('startDate', formData.startDate);
        payload.append('endDate', formData.endDate);
        payload.append('reason', formData.reason);
        payload.append('leaveType', formData.leaveType);
        if (formData.attachment) payload.append('file', formData.attachment);
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      console.log("DEBUG: Sending Payload:", payload);

      const endpoint = editData 
        ? (isWFH ? `${API.UPDATE_WFH}/${editData._id}` : `${API.UPDATE_LEAVE}/${editData._id}`)
        : (isWFH ? API.ADD_WFH : API.ADD_LEAVE);

      if (editData) {
        await axios.put(endpoint, payload, { headers });
      } else {
        await axios.post(endpoint, payload, { headers });
      }

      toast.success(`${type} Request ${editData ? 'Updated' : 'Submitted'} Successfully!`);
      navigate(isWFH ? '/wfh-history' : '/leave-history');

    } catch (err) {
      console.error("Submission Error Response:", err.response?.data);
      toast.error(err.response?.data?.message || "Validation Error. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, handleInputChange, handleSubmit, isEdit: !!editData };
};