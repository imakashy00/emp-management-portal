import React from 'react';

const RoleBadge = ({ userName, role }) => (
  <div className="bg-[#FFD966] text-[#1C4587] px-5 py-1.5 rounded-full text-xs font-extrabold shadow-sm border border-[#EAC75D]">
    {userName} / {role}
  </div>
);

export default RoleBadge;