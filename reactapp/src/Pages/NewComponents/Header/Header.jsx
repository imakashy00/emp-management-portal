import React from 'react';
import MobileMenuButton from './MobileMenuButton';
import RoleBadge from './RoleBadge';

const Header = ({ onToggleMenu, userName, role }) => (
  <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 md:px-10 border-b border-gray-100">
    <MobileMenuButton onClick={onToggleMenu} />
    <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Dashboard Overview</h2>
    <div className="flex items-center">
      <RoleBadge userName={userName} role={role} />
    </div>
  </header>
);

export default Header;
