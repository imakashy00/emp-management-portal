
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-hot-toast';

export const useForm = (type) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'Sick Leave',
    file: null // This will hold either a File Object (new) or a String (existing filename)
  });

  useEffect(() => {
    if (editData) {
      const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];
      setFormData({
        startDate: formatDate(editData.startDate),
        endDate: formatDate(editData.endDate),
        reason: editData.reason,
        leaveType: editData.leaveType || 'Sick Leave',
        file: editData.file || null // Bring existing filename into the form
      });
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    // If it's a file input, we store the File object, otherwise the text value
    setFormData({ ...formData, [name]: files ? files[0] : value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const isWFH = type === 'WFH';

      // Always use FormData for consistency when files are involved
      const payload = new FormData();
      payload.append('startDate', formData.startDate);
      payload.append('endDate', formData.endDate);
      payload.append('reason', formData.reason);
      if (!isWFH) payload.append('leaveType', formData.leaveType);

      // FILE LOGIC:
      // If formData.file is an Object, it's a new upload.
      // If it's a string, it's the existing file (don't re-upload).
      if (formData.file && typeof formData.file !== 'string') {
        payload.append('file', formData.file);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const baseUrl = isWFH ? API.WFH : API.GET_LEAVE_BY_USER;
      const endpoint = editData ? `${baseUrl}/${editData._id}` : baseUrl;
      const method = editData ? 'put' : 'post';

      const response = await axios[method](endpoint, payload, config);

      toast.success(response.data.message);
      navigate(isWFH ? '/wfh-history' : '/leave-history');

    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, errors, handleInputChange, handleSubmit, isEdit: !!editData };
};