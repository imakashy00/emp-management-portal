import React, { useState } from 'react';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';

const WfhForm = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Date Validation (Ref: Page 32)
    const today = new Date().toISOString().split('T')[0];
    if (formData.startDate < today) return toast.error("Start date cannot be in the past");
    if (formData.endDate < formData.startDate) return toast.error("End date cannot be before start date");

    try {
      const userId = localStorage.getItem('userId');
      const payload = { ...formData, userId, status: 'Pending' };
      
      await axios.post(API.ADD_WFH, payload);
      toast.success("WFH Request Submitted successfully!");
      setFormData({ startDate: '', endDate: '', reason: '' });
    } catch (err) {
      toast.error("Failed to submit request");
    }
  };

  return (
    <div className="flex-1 p-10 bg-[#f4f7f6]">
      <div className="max-w-[550px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#1C4587] p-6 text-white text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest">Apply WFH Request</h2>
          <div className="w-12 h-1 bg-[#FFD966] mx-auto mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Reason *</label>
            <textarea name="reason" value={formData.reason} onChange={handleInput} placeholder="State your reason..." required className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#3C78D8] text-sm h-24 resize-none" />
          </div>

          <button type="submit" className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95">
            Add Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default WfhForm;