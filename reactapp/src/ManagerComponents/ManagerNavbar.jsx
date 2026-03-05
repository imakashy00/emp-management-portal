import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerNavbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Manager';
  const role = localStorage.getItem('userRole') || 'manager';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-[#1C4587] to-[#3C78D8] px-8 py-3 flex justify-between items-center shadow-md">
      <div className="text-white font-bold text-xl tracking-tighter uppercase italic cursor-pointer" onClick={() => navigate('/home')}>
        WORKBUDDY
      </div>

      <div className="flex items-center gap-6 text-white text-sm font-medium">
        <div className="bg-[#FFD966] text-[#1C4587] px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
          {userName} / {role}
        </div>
        
        <button onClick={() => navigate('/home')} className="hover:text-[#FFD966] transition-colors">Home</button>
        <button onClick={() => navigate('/employees')} className="hover:text-[#FFD966] transition-colors">Employees</button>
        <button onClick={() => navigate('/manager/wfh')} className="hover:text-[#FFD966] transition-colors">WFH Request</button>
        <button onClick={() => navigate('/manager/leave')} className="hover:text-[#FFD966] transition-colors">Leave Request</button>
        <button onClick={() => navigate('/invite-manager')} className="hover:text-[#FFD966] transition-colors italic border-l pl-4 border-white/20">Invite Manager</button>
        <button onClick={handleLogout} className="bg-[#E53E3E] px-4 py-1.5 rounded font-bold hover:bg-red-700 transition-colors ml-4">Logout</button>
      </div>
    </nav>
  );
};

export default ManagerNavbar;