import React from 'react';
import NavItem from './NavItem';
import NavSection from './NavSection';

const Sidebar = ({
  isOpen,
  isManager,
  onNavigate,
  onLogout,
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C4587] text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out shadow-xl`}
    >
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-xl font-bold uppercase tracking-tight text-white">WorkBuddy</h1>
      </div>

      <nav className="mt-6 px-4 space-y-1">
        <NavItem label="Home" icon="🏠" onClick={() => onNavigate('/home')} />

        {isManager ? (
          <>
            <NavItem label="Employees" icon="👥" onClick={() => onNavigate('/employees')} />
            <NavItem label="WFH Request" icon="📂" onClick={() => onNavigate('/manager/wfh')} />
            <NavItem label="Leave Request" icon="📄" onClick={() => onNavigate('/manager/leave')} />
            <NavItem
              label="Invite Manager"
              icon="✉️"
              onClick={() => onNavigate('/invite-manager')}
              className="border-t border-blue-800 mt-2 pt-4"
            />
          </>
        ) : (
          <>
            <NavSection title="Work From Home" />
            <NavItem label="Apply WFH" icon="➕" onClick={() => onNavigate('/apply-wfh')} />
            <NavItem label="My WFH history" icon="📊" onClick={() => onNavigate('/wfh-history')} />

            <NavSection title="Leaves" className="pt-6" />
            <NavItem label="Apply Leave" icon="➕" onClick={() => onNavigate('/apply-leave')} />
            <NavItem label="My Leave history" icon="📊" onClick={() => onNavigate('/leave-history')} />
          </>
        )}
      </nav>

      {/* Logout at bottom */}
      <div className="absolute bottom-5 w-full px-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-sm bg-[#E53E3E] hover:bg-red-700 text-white rounded-lg transition-colors font-bold shadow-lg"
        >
          <span>🚪</span> <span className="ml-3">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
