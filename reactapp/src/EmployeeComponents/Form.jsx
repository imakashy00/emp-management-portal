import React from 'react';
import { Calendar, FileText, Upload, Briefcase, Activity } from 'lucide-react';
import {useForm} from '../hooks/useForm'; // You might want to rename this hook to useLeave
import Input from '../Components/Input';
import Button from '../Components/Button';

const Form = ({ type = 'WFH' }) => {
  // Use the hook (ensure your hook handles the 'type' if needed for API calls)
  const { formData, loading, handleInputChange, handleSubmit } = useForm(type);

  const isSickLeave = type === 'SICK_LEAVE';

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Dynamic Header */}
        <div className={`${isSickLeave ? 'bg-red-700' : 'bg-[#1C4587]'} p-8 text-center relative transition-colors duration-300`}>
          <div className="absolute top-4 right-4 opacity-10 text-white">
            {isSickLeave ? <Activity size={80} /> : <Briefcase size={80} />}
          </div>
          
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest relative z-10">
            {isSickLeave ? 'Sick Leave Request' : 'Work From Home Request'}
          </h2>
          
          <div className={`w-16 h-1.5 ${isSickLeave ? 'bg-white' : 'bg-yellow-400'} mx-auto mt-3 rounded-full relative z-10`}></div>
          
          <p className="text-blue-50 text-xs mt-4 uppercase tracking-tighter opacity-80">
            {isSickLeave 
              ? 'Please attach a medical certificate for approval' 
              : 'Please provide valid dates and reasoning for your request'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              required
              icon={Calendar}
              value={formData.startDate}
              onChange={handleInputChange}
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              required
              icon={Calendar}
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Reason Field */}
          <Input
            label="Reason / Diagnosis"
            name="reason"
            type="text" // Note: Your Input component uses <input />, if you need textarea, you'd need to update Input.jsx
            required
            placeholder={isSickLeave ? "Brief description of illness..." : "Explain necessity for remote work..."}
            value={formData.reason}
            onChange={handleInputChange}
          />

          {/* File Upload - MANDATORY for Sick Leave */}
          <div className="relative">
            <Input
              label={isSickLeave ? "Medical Certificate (Required)" : "Supporting Document (Optional)"}
              name="attachment"
              type="file"
              required={isSickLeave} // This makes it mandatory in HTML5 validation
              icon={Upload}
              onChange={handleInputChange}
              accept=".pdf,.png,.jpg,.jpeg"
              className="file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />
            {isSickLeave && (
                <span className="text-[9px] text-red-500 absolute -bottom-4 left-0 font-bold uppercase">
                    * Document is required for medical clearance
                </span>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              loading={loading}
              className={isSickLeave ? "bg-red-700 hover:bg-red-800" : ""}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={18} />
                <span>{isSickLeave ? 'Submit Medical Leave' : 'Submit WFH Request'}</span>
              </div>
            </Button>
          </div>
          
          <p className="text-center text-[10px] text-gray-400 italic">
            Note: All requests are subject to HR and Managerial review.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Form;