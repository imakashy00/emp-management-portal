import React from 'react';

const Input = ({ label, icon: Icon, error, className = "", ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {/* Lucide icon is hidden for dates to prevent double icons */}
        {Icon && props.type !== 'date' && (
          <Icon className="absolute left-0 text-gray-400 group-focus-within:text-[#1C4587] transition-colors w-4 h-4" />
        )}
        <input
          {...props}
          className={`w-full py-2 border-b-2 outline-none transition-all text-sm font-normal text-gray-700 bg-transparent 
            ${Icon && props.type !== 'date' ? 'pl-7' : 'pl-0'}
            ${error ? 'border-red-500' : 'border-gray-100 focus:border-[#1C4587]'} 
            ${className}`}
        />
      </div>
      {error && <p className="text-[#CC0000] text-[9px] mt-1 font-semibold italic">{error}</p>}
    </div>
  );
};

export default Input;