import React, { useState } from 'react';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: '',
    file: null
  });

  const handleInput = (e) => {
    if (e.target.name === 'file') {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Date Validation
    const today = new Date().toISOString().split('T')[0];
    if (formData.startDate < today) return toast.error("Start date cannot be in the past");

    try {
      const userId = localStorage.getItem('userId');
      
      // Using FormData because of the file upload requirement (Ref: Page 6)
      const data = new FormData();
      data.append('userId', userId);
      data.append('startDate', formData.startDate);
      data.append('endDate', formData.endDate);
      data.append('reason', formData.reason);
      data.append('leaveType', formData.leaveType);
      data.append('file', formData.file);
      data.append('status', 'Pending');

      await axios.post(API.ADD_LEAVE, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Leave Request Added Successfully!");
      setFormData({ startDate: '', endDate: '', reason: '', leaveType: '', file: null });
    } catch (err) {
      toast.error("Error submitting leave request");
    }
  };

  return (
    <div className="flex-1 p-10 bg-[#f4f7f6]">
      <div className="max-w-[550px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#1C4587] p-6 text-white text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest">Apply Leave Request</h2>
          <div className="w-12 h-1 bg-[#FFD966] mx-auto mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Start Date *</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleInput} required className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#3C78D8] text-sm" />
            </div>
            <div className="group">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">End Date *</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleInput} required className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#3C78D8] text-sm" />
            </div>
          </div>

          <div className="group">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Leave Type *</label>
            <select name="leaveType" value={formData.leaveType} onChange={handleInput} required className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#3C78D8] text-sm bg-transparent">
              <option value="">Select Type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="PTO">PTO</option>
            </select>
          </div>

          <div className="group">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Reason *</label>
            <textarea name="reason" value={formData.reason} onChange={handleInput} placeholder="Why are you applying?" required className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#3C78D8] text-sm h-20 resize-none" />
          </div>

          <div className="group">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Attachment (Medical Certificate) *</label>
            <input type="file" name="file" onChange={handleInput} required className="text-xs text-gray-400 mt-2" />
          </div>

          <button type="submit" className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded-lg font-bold transition-all shadow-lg">
            Add Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;