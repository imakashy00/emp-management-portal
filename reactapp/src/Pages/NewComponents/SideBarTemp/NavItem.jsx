import React from 'react';

const NavItem = ({ label, icon, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors group ${className}`}
  >
    <span className="opacity-70 group-hover:opacity-100">{icon}</span>
    <span className="ml-3">{label}</span>
  </button>
);

export default NavItem;