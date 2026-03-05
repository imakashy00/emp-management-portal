import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeNavbar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal State
  
  const userName = localStorage.getItem('userName') || 'Employee';
  const role = localStorage.getItem('userRole') || 'employee';

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-[#1C4587] to-[#3C78D8] px-8 py-3 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div className="text-white font-bold text-xl tracking-tighter uppercase italic cursor-pointer" onClick={() => navigate('/home')}>
          WORKBUDDY
        </div>

        <div className="flex items-center gap-6 text-white text-sm font-medium">
          <div className="bg-[#FFD966] text-[#1C4587] px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
            {userName} / {role}
          </div>
          
          <button onClick={() => navigate('/home')} className="hover:text-[#FFD966] transition-colors">Home</button>
          <button onClick={() => navigate('/apply-wfh')} className="hover:text-[#FFD966] transition-colors">WFH</button>
          <button onClick={() => navigate('/apply-leave')} className="hover:text-[#FFD966] transition-colors">Leave</button>
          
          {/* Trigger Modal instead of immediate logout */}
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="bg-[#E53E3E] px-4 py-1.5 rounded font-bold hover:bg-red-700 transition-colors shadow-md transform active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* --- LOGOUT CONFIRMATION MODAL (Ref: Page 44) --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all border border-gray-100">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Logout</h3>
              <p className="text-gray-500 text-sm mb-8">Are you sure you want to logout? You will need to login again to access your dashboard.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={confirmLogout}
                  className="flex-1 bg-[#6AA84F] hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-colors"
                >
                  Yes, Logout
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-[#E53E3E] hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeNavbar;