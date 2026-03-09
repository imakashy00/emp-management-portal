
import React, { useRef } from 'react';
import { FileText, Calendar, AlignLeft, Loader2, Paperclip, Briefcase, Activity } from 'lucide-react';
import { useForm } from '../hooks/useForm';
import { Toaster } from 'react-hot-toast';

const Form = ({ type = 'WFH' }) => {
  const { formData, loading, errors, handleInputChange, handleSubmit, isEdit } = useForm(type);
  const isLeave = type === 'LEAVE';
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-xl mx-auto font-sans antialiased text-gray-900  pb-20">
      <Toaster position="top-center" />

      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
          {isLeave ? <Activity className="text-blue-300" size={24} /> : <Briefcase className="text-blue-300" size={24} />}
        </div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          {isEdit ? 'Update' : 'New'} {type} Request
        </h1>
        <p className="text-sm text-gray-500">
          {isLeave ? 'Submit an application for official leave' : 'Apply for remote work authorization'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 my-5" noValidate>

        {/* Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest ml-1">Start Date</p>
            <div className="relative">
              {/* <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" /> */}
              <input 
                name="startDate"
                type="date"
                min={today}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-gray-200 outline-none transition-all"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            {errors.startDate && <p className="text-[10px] text-red-500 ml-1">{errors.startDate}</p>}
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest ml-1">End Date</p>
            <div className="relative">
              {/* <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" /> */}
              <input 
                name="endDate"
                type="date"
                min={formData.startDate || today}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-gray-200 outline-none transition-all"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
            {errors.endDate && <p className="text-[10px] text-red-500 ml-1">{errors.endDate}</p>}
          </div>
        </div>


        {/* Leave Category (Conditional) */}
        {isLeave && (
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest ml-1">Category</p>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 cursor-pointer appearance-none transition-all"
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="PTO">PTO</option>
              <option value="Vacation">Vacation</option>
            </select>
          </div>
        )}

        {/* Reason Field */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest ml-1">Justification</p>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-gray-300" />
            <textarea
              name="reason"
              placeholder="Provide a detailed reason..."
              rows="3"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-gray-200 outline-none transition-all resize-none"
              value={formData.reason}
              onChange={handleInputChange}
            />
          </div>
          {errors.reason && <p className="text-[10px] text-red-500 ml-1">{errors.reason}</p>}
        </div>

        {/* File Upload (Conditional) */}
        {isLeave && (
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest ml-1">Attachments (Optional)</p>
            <div className="relative group">
              <div className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 border-dashed border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100/50 transition-all">
                <Paperclip size={16} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium truncate">
                  {formData.file ? 'Document selected' : 'Upload supporting documentation'}
                </span>
                <input
                  name="file"
                  type="file"
                  onChange={handleInputChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <FileText size={18} />
            )}
            <span>{loading ? 'Processing...' : (isEdit ? `Update ${type}` : `Submit ${type}`)}</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-[10px] text-gray-300 uppercase tracking-widest font-medium">Internal WorkBuddy Protocol</p>
        </div>
      </form>
    </div>
  );
};

export default Form;