import React from 'react';

const NavSection = ({ title, className = '' }) => (
  <div className={`pt-4 pb-1 px-4 text-[10px] uppercase text-blue-300 font-bold tracking-widest ${className}`}>
    {title}
  </div>
);

export default NavSection;