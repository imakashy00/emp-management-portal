import React from 'react';

const MobileMenuButton = ({ onClick }) => (
  <button onClick={onClick} className="md:hidden text-[#1C4587] text-2xl">☰</button>
);

export default MobileMenuButton;