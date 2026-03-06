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
    leaveType: 'Sick Leave', // Matches the updated model enum
    file: null
  });

  useEffect(() => {
    if (editData) {
      const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];
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
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedId = localStorage.getItem('userId');
      if (!storedId) return toast.error("Session expired. Please Login.");

      const isWFH = type === 'WFH';
      let payload;
      let headers = {};

      if (isWFH) {
        payload = {
          employeeId: storedId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason
        };
        headers = { 'Content-Type': 'application/json' };
      } else {
        payload = new FormData();
        payload.append('employeeId', storedId);
        payload.append('startDate', formData.startDate);
        payload.append('endDate', formData.endDate);
        payload.append('reason', formData.reason);
        payload.append('leaveType', formData.leaveType);
        if (formData.file) payload.append('file', formData.file);
        headers = { 'Content-Type': 'multipart/form-data' };
      }

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
      toast.error(err.response?.data?.message || "Validation Error. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, handleInputChange, handleSubmit, isEdit: !!editData };
};