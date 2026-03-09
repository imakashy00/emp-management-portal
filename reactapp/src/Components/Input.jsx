
import React from 'react';

const Input = ({ label, icon: Icon, onIconClick, error, className = "", ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          {...props}
          className={`w-full py-2 border-b-2 outline-none transition-all text-sm font-normal text-gray-700 bg-transparent 
          ${Icon && props.type !== 'date' ? 'pr-7' : 'pr-0'} 
          ${error ? 'border-red-500' : 'border-gray-100 focus:border-[#1C4587]'} 
          ${className}`}
        />

        {Icon && props.type !== 'date' && (
          <Icon
            onClick={onIconClick} // Added the click handler
            className={`absolute right-0 text-gray-400 hover:text-[#1C4587] transition-colors w-4 h-4 
              ${onIconClick ? 'cursor-pointer' : ''}`} // Makes it look clickable
          />
        )}
      </div>
      {error && <p className="text-[#CC0000] text-[9px] mt-1 font-semibold italic">{error}</p>}
    </div>
  );
};

export default Input;
