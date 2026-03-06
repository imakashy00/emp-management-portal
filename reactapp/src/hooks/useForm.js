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
    leaveType: 'Sick Leave', // Added for Leave functionality
    attachment: null
  });

  useEffect(() => {
    if (editData) {
      const formatDate = (d) => new Date(d).toISOString().split('T')[0];
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
      const userId = localStorage.getItem('userId');
      const isWFH = type === 'WFH';

      // --- ENDPOINT SELECTION ---
      const createURL = isWFH ? API.ADD_WFH : API.ADD_LEAVE;
      const updateURL = isWFH ? `${API.UPDATE_WFH}/${editData?._id}` : `${API.UPDATE_LEAVE}/${editData?._id}`;
      const finalURL = editData ? updateURL : createURL;

      // --- PAYLOAD SELECTION ---
      let payload;
      let headers = {};

      if (isWFH) {
        // WFH uses JSON
        payload = { ...formData, employeeId: userId };
        headers = { 'Content-Type': 'application/json' };
      } else {
        // LEAVE uses FormData for file upload
        payload = new FormData();
        payload.append('employeeId', userId);
        payload.append('startDate', formData.startDate);
        payload.append('endDate', formData.endDate);
        payload.append('reason', formData.reason);
        payload.append('leaveType', formData.leaveType);
        if (formData.attachment) payload.append('file', formData.attachment);
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      if (editData) {
        await axios.put(finalURL, payload, { headers });
      } else {
        await axios.post(finalURL, payload, { headers });
      }

      toast.success(`${type} Request ${editData ? 'Updated' : 'Submitted'} Successfully!`);
      navigate(isWFH ? '/wfh-history' : '/leave-history');

    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, handleInputChange, handleSubmit, isEdit: !!editData };
};