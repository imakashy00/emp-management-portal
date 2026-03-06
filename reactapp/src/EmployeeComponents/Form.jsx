import React from 'react';
import { Calendar, FileText, Upload, Briefcase, Activity } from 'lucide-react';
import { useForm } from '../hooks/useForm'; 
import Input from '../Components/Input';
import Button from '../Components/Button';

const Form = ({ type = 'WFH' }) => {
  const { formData, loading, handleInputChange, handleSubmit, isEdit } = useForm(type);
  const isLeave = type === 'LEAVE';

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-[#f4f7f6]">
      <div className="w-full max-w-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        <div className="bg-[#1C4587] p-8 text-center relative">
          <div className="absolute top-4 right-4 opacity-10 text-white pointer-events-none">
            {isLeave ? <Activity size={80} /> : <Briefcase size={80} />}
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest relative z-10">
            {isEdit ? 'Update' : 'Apply'} {isLeave ? 'Leave' : 'WFH'} Request
          </h2>
          <div className="w-16 h-1.5 bg-[#FFD966] mx-auto mt-3 rounded-full relative z-10"></div>
          <p className="text-blue-100 text-[10px] mt-4 uppercase tracking-tighter opacity-80 font-bold">
            {isLeave ? 'Provide leave details and supporting documents' : 'Professional remote work scheduling'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Start Date *" name="startDate" type="date" required icon={Calendar} value={formData.startDate} onChange={handleInputChange} />
            <Input label="End Date *" name="endDate" type="date" required icon={Calendar} value={formData.endDate} onChange={handleInputChange} />
          </div>

          {isLeave && (
            <div className="group">
               <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Leave Category *</label>
               {/* STYLING FIXED: Removed font-bold from the select element */}
               <select 
                  name="leaveType" 
                  value={formData.leaveType} 
                  onChange={handleInputChange} 
                  required
                  className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-[#3C78D8] transition-all text-sm bg-transparent appearance-none"
               >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="PTO">PTO</option>
                  <option value="Vacation">Vacation</option>
               </select>
            </div>
          )}

          <Input label="Reason / Diagnosis *" name="reason" type="text" required value={formData.reason} onChange={handleInputChange} />

          {isLeave && (
            <div className="relative">
              <Input label="Supporting Document" name="file" type="file" icon={Upload} onChange={handleInputChange} />
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" loading={loading} className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg transform active:scale-95 transition-all">
              <div className="flex items-center justify-center gap-2">
                <FileText size={18} />
                <span>{isEdit ? `Update ${type} Request` : `Submit ${type} Request`}</span>
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;