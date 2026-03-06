import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Laptop,
  FileText,
  UserPlus,
  History,
  LogOut,
  User,
  FilePlus
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-md group ${isActive
      ? 'bg-[#3C78D8] text-[#fff] shadow-sm'
      : 'text-gray-500 hover:bg-white/10 hover:text-[#1C4587]'
      }`}
  >
    <Icon
      size={20}
      strokeWidth={isActive ? 2.5 : 2}
      className={isActive ? 'text-[#fff]' : 'text-gray-600 group-hover:text-[#1C4587]'}
    />
    <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
      {label}
    </span>
  </button>
);

const Sidebar = ({ isOpen, isManager, onNavigate, onLogout, userName, role }) => {
  const location = useLocation();
  const isPathActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#fff] text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-md flex flex-col`}
    >
      {/* Brand Section */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-[#1C4587]">
            WorkBuddy
          </h1>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <SidebarItem
          icon={Home}
          label="Dashboard"
          isActive={isPathActive('/') || isPathActive('/')}
          onClick={() => onNavigate('/')}
        />

        {isManager ? (
          <div className="pt-6 space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">Management</p>
            <SidebarItem icon={Users} label="Employee Directory" isActive={isPathActive('/employees')} onClick={() => onNavigate('/employees')} />
            <SidebarItem icon={Laptop} label="WFH Approvals" isActive={isPathActive('/manager/wfh')} onClick={() => onNavigate('/manager/wfh')} />
            <SidebarItem icon={FileText} label="Leave Approvals" isActive={isPathActive('/manager/leave')} onClick={() => onNavigate('/manager/leave')} />
            <div className=" pt-4 border-t my-3">
              <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] my-3">Invite</p>
              <SidebarItem icon={UserPlus} label="Invite Manager" isActive={isPathActive('/invite-manager')} onClick={() => onNavigate('/invite-manager')} />
            </div>
          </div>
        ) : (
          <div className="pt-6 space-y-6">
            <div>
              <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">Remote Work</p>
              <SidebarItem icon={FilePlus} label="Apply for WFH" isActive={isPathActive('/apply-wfh')} onClick={() => onNavigate('/apply-wfh')} />
              <SidebarItem icon={History} label="My WFH History" isActive={isPathActive('/wfh-history')} onClick={() => onNavigate('/wfh-history')} />
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">Time Off</p>
              <SidebarItem icon={FilePlus} label="Request Leave" isActive={isPathActive('/apply-leave')} onClick={() => onNavigate('/apply-leave')} />
              <SidebarItem icon={History} label="Leave History" isActive={isPathActive('/leave-history')} onClick={() => onNavigate('/leave-history')} />
            </div>
          </div>
        )}
      </nav>

      {/* Footer / Logout Section */}
      <div className="mt-auto p-4 border-t border-[#EEEEEE] space-y-2">

        {/* Professional User Card */}
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#3C78D8] transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#fff] flex items-center justify-center text-gray-500 ">
            <User size={20} strokeWidth={2} />
          </div>
          <div className="flex min-w-0">
            <span className="text-sm font-bold text-gray-500 truncate group-hover:text-[#fff]">
              {userName || 'User Name'}/{role || 'Role'}
            </span>
          </div>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-sm bg-white hover:bg-red-500 text-red-400 hover:text-white rounded-md transition-all duration-300 font-bold group"
        >
          <LogOut size={18} className="text-white-400 group-hover:text-white transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;