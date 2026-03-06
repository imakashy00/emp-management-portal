import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import {
  Home, Users, Laptop, FileText, UserPlus, History, LogOut, User, FilePlus, AlertTriangle
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-md group transition-all ${isActive
      ? 'bg-[#3C78D8] text-[#fff] shadow-md'
      : 'text-gray-500 hover:bg-[#F8FAFC] hover:text-[#1C4587]'
      }`}
  >
    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
    <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

const Sidebar = ({ isOpen, isManager, onLogout, userName, role }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Using local navigate to ensure paths are correct
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const isPathActive = (path) => location.pathname === path;

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#fff] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg flex flex-col border-r border-gray-100`}>
        
        {/* Brand Section */}
        <div className="p-8 mb-2">
          <h1 className="text-2xl font-black tracking-tighter text-[#1C4587] italic uppercase">WorkBuddy</h1>
          <div className="w-8 h-1 bg-[#FFD966] mt-1 rounded-full"></div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {/* FIXED PATH: Navigate to /home instead of / to avoid login redirect */}
          <SidebarItem 
            icon={Home} 
            label="Dashboard" 
            isActive={isPathActive('/')} 
            onClick={() => navigate('/')} 
          />

          {isManager ? (
            <div className="pt-6 space-y-1.5">
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Management</p>
              <SidebarItem icon={Users} label="Employee Directory" isActive={isPathActive('/employees')} onClick={() => navigate('/employees')} />
              <SidebarItem icon={Laptop} label="WFH Approvals" isActive={isPathActive('/manager/wfh')} onClick={() => navigate('/manager/wfh')} />
              <SidebarItem icon={FileText} label="Leave Approvals" isActive={isPathActive('/manager/leave')} onClick={() => navigate('/manager/leave')} />
              <div className="pt-4 border-t border-gray-50 my-3">
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">System</p>
                <SidebarItem icon={UserPlus} label="Invite Manager" isActive={isPathActive('/invite-manager')} onClick={() => navigate('/invite-manager')} />
              </div>
            </div>
          ) : (
            <div className="pt-6 space-y-6">
              <div>
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Remote Work</p>
                <SidebarItem icon={FilePlus} label="Apply for WFH" isActive={isPathActive('/apply-wfh')} onClick={() => navigate('/apply-wfh')} />
                <SidebarItem icon={History} label="My WFH History" isActive={isPathActive('/wfh-history')} onClick={() => navigate('/wfh-history')} />
              </div>
              <div>
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Time Off</p>
                <SidebarItem icon={FilePlus} label="Request Leave" isActive={isPathActive('/apply-leave')} onClick={() => navigate('/apply-leave')} />
                <SidebarItem icon={History} label="Leave History" isActive={isPathActive('/leave-history')} onClick={() => navigate('/leave-history')} />
              </div>
            </div>
          )}
        </nav>

        {/* Footer / User & Logout */}
        <div className="mt-auto p-4 border-t border-[#EEEEEE] space-y-2 bg-gray-50/50">
          <Link to="/profile" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isPathActive('/profile') ? 'bg-[#3C78D8] text-white shadow-md' : 'hover:bg-[#F8FAFC] text-gray-500'}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${isPathActive('/profile') ? 'bg-white/20' : 'bg-white'}`}>
              <User size={20} className={isPathActive('/profile') ? 'text-white' : 'text-[#1C4587]'} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-sm font-bold truncate ${isPathActive('/profile') ? 'text-white' : 'text-gray-700'}`}>{userName || 'User'}</span>
              <span className={`text-[10px] uppercase font-bold tracking-widest ${isPathActive('/profile') ? 'text-white/70' : 'opacity-60'}`}>{role}</span>
            </div>
          </Link>
          
          <button
            onClick={() => setShowLogoutModal(true)} // Open Confirmation
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold group"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sign Out?</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Are you sure you want to log out of WorkBuddy? Any unsaved changes may be lost.</p>
              <div className="flex gap-3">
                {/* CALL THE ACTUAL ONLOGOUT PROP HERE */}
                <button onClick={onLogout} className="flex-1 bg-[#E53E3E] hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95">Log Out</button>
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl transition-all">Stay</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;