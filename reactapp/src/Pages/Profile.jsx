import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, ShieldCheck, 
  Hash, ArrowLeft, Copy, CheckCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';

const ProfileField = ({ icon: Icon, label, value }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`, { autoClose: 1000, hideProgressBar: true });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#3C78D8] transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1C4587] shadow-sm group-hover:scale-110 transition-transform">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
          <p className="text-sm font-bold text-gray-800 break-all">{value || 'Not Provided'}</p>
        </div>
      </div>
      <button 
        onClick={copyToClipboard}
        className="text-gray-300 hover:text-[#3C78D8] opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy"
      >
        <Copy size={14} />
      </button>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();

  // Data fetching from localStorage (Standardized with your Login logic)
  const userName = localStorage.getItem('userName') || 'Authorized User';
  const role = localStorage.getItem('userRole') || 'Employee';
  const userId = localStorage.getItem('userId') || 'WB-000000';
  
  // Note: If you don't save email in Login, this will show a fallback
  const email = localStorage.getItem('userEmail') || 'contact@workbuddy.com'; 
  const mobile = localStorage.getItem('userMobile') || '+91 98765 43210';

  const isManager = role?.toLowerCase() === 'manager';

  return (
    <div className="p-4 md:p-12 bg-[#F8FAFC] min-h-screen flex flex-col items-center">
      
      {/* Top Navigation Row */}
      <div className="w-full max-w-2xl mb-6 flex justify-start">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-[#1C4587] font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Section with WorkBuddy Theme */}
        <div className="bg-gradient-to-br from-[#1C4587] to-[#3C78D8] p-10 text-center relative">
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="w-28 h-28 bg-white rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl mb-4 border-4 border-white/20">
              <User size={56} className="text-[#1C4587]" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">{userName}</h2>
            <div className="inline-flex items-center gap-2 bg-[#FFD966] text-[#1C4587] px-4 py-1.5 rounded-full text-[10px] font-black uppercase mt-3 shadow-lg">
              <CheckCircle size={12} /> {role} Account
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileField icon={Mail} label="Official Email" value={email} />
            <ProfileField icon={Phone} label="Contact Link" value={mobile} />
            <ProfileField icon={ShieldCheck} label="Permission Level" value={isManager ? "Administrative" : "Standard"} />
            <ProfileField icon={Hash} label="System ID" value={userId} />
          </div>

          {/* Role-Specific Badge / Status */}
          <div className="mt-8">
            {isManager ? (
              <div className="p-6 bg-blue-50 rounded-[1.5rem] border border-blue-100 flex items-start gap-4">
                <div className="bg-blue-500 text-white p-2 rounded-lg shadow-md">
                   <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Privileged Access</p>
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    As a Manager, you have full authorization to approve WFH schedules and process leave requests for your team members.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-green-50 rounded-[1.5rem] border border-green-100 flex items-start gap-4">
                <div className="bg-green-500 text-white p-2 rounded-lg shadow-md">
                   <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Employment Status</p>
                  <p className="text-xs text-green-800 leading-relaxed font-medium">
                    Your profile is currently active. You are eligible for the standard employee benefits package including flexible WFH hours.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Card Info */}
        <div className="px-10 py-6 bg-gray-50/80 text-center border-t border-gray-100 flex items-center justify-center gap-3">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
           <p className="text-[9px] text-gray-400 uppercase font-black tracking-[0.4em]">WorkBuddy Identity Verification Protocol</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;