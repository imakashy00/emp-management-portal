import React from 'react';
import { Calendar, FileText, Upload, Briefcase, Activity } from 'lucide-react';
import { useForm } from '../hooks/useForm'; 
import Input from '../Components/Input';
import Button from '../Components/Button';

const Form = ({ type = 'WFH' }) => {
  const { formData, loading, handleInputChange, handleSubmit, isEdit } = useForm(type);

  // Updated check to handle 'LEAVE' type correctly
  const isLeave = type === 'LEAVE';

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-[#f4f7f6]">
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Dynamic Header - Changes color and text based on type */}
        <div className={`${isLeave ? 'bg-red-700' : 'bg-[#1C4587]'} p-8 text-center relative transition-colors duration-300`}>
          <div className="absolute top-4 right-4 opacity-10 text-white">
            {isLeave ? <Activity size={80} /> : <Briefcase size={80} />}
          </div>
          
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest relative z-10">
            {isEdit ? 'Update' : 'Apply'} {isLeave ? 'Leave' : 'WFH'} Request
          </h2>
          
          <div className={`w-16 h-1.5 ${isLeave ? 'bg-white' : 'bg-yellow-400'} mx-auto mt-3 rounded-full relative z-10`}></div>
          
          <p className="text-blue-50 text-xs mt-4 uppercase tracking-tighter opacity-80">
            {isEdit 
              ? 'Modify your request details below' 
              : (isLeave ? 'Please attach a medical certificate for approval' : 'Provide valid dates and reasoning')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Start Date" name="startDate" type="date" required icon={Calendar} value={formData.startDate} onChange={handleInputChange} />
            <Input label="End Date" name="endDate" type="date" required icon={Calendar} value={formData.endDate} onChange={handleInputChange} />
          </div>

          {/* New field: Leave Type (Only shows for LEAVE) */}
          {isLeave && (
            <div className="group">
               <label className="text-[11px] text-gray-400 font-bold uppercase block mb-1">Leave Type *</label>
               <select name="leaveType" value={formData.leaveType} onChange={handleInputChange} className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-red-700 text-sm bg-transparent">
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="PTO">PTO</option>
               </select>
            </div>
          )}

          <Input label="Reason / Diagnosis" name="reason" type="text" required value={formData.reason} onChange={handleInputChange} />

          {/* File Upload (Only shows for LEAVE) */}
          {isLeave && (
            <div className="relative">
              <Input label="Medical Certificate (Optional)" name="attachment" type="file" icon={Upload} onChange={handleInputChange} />
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" loading={loading} className={isLeave ? "bg-red-700 hover:bg-red-800" : ""}>
              <div className="flex items-center justify-center gap-2">
                <FileText size={18} />
                <span className="font-bold">
                  {isEdit ? `Update ${type} Request` : `Submit ${type} Request`}
                </span>
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;