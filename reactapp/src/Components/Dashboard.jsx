import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    
    if (!userRole) {
      navigate('/login');
    } else {
      setRole(userRole);
      setUserName(storedName || 'User');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isManager = role === 'Manager' || role === 'manager';

  return (
    <div className="flex h-screen bg-[#f4f7f6] font-['Segoe_UI',sans-serif]">
      
      {/* --- SIDEBAR NAVBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C4587] text-white transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out shadow-xl`}>
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold uppercase tracking-tight text-white">WorkBuddy</h1>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          <button onClick={() => navigate('/home')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors group">
             <span className="opacity-70 group-hover:opacity-100">🏠</span> <span className="ml-3">Home</span>
          </button>

          {/* MANAGER SPECIFIC OPTIONS (Based on your 2nd Screenshot + Invite Manager) */}
          {isManager ? (
            <>
              <button onClick={() => navigate('/employees')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors group">
                <span className="opacity-70 group-hover:opacity-100">👥</span> <span className="ml-3">Employees</span>
              </button>
              <button onClick={() => navigate('/manager/wfh')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors group">
                <span className="opacity-70 group-hover:opacity-100">📂</span> <span className="ml-3">WFH Request</span>
              </button>
              <button onClick={() => navigate('/manager/leave')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors group">
                <span className="opacity-70 group-hover:opacity-100">📄</span> <span className="ml-3">Leave Request</span>
              </button>
              {/* NEW OPTION ADDED HERE */}
              <button onClick={() => navigate('/invite-manager')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors group border-t border-blue-800 mt-2 pt-4">
                <span className="opacity-70 group-hover:opacity-100">✉️</span> <span className="ml-3">Invite Manager</span>
              </button>
            </>
          ) : (
            /* EMPLOYEE SPECIFIC OPTIONS (Based on your 1st Screenshot) */
            <>
              <div className="pt-4 pb-1 px-4 text-[10px] uppercase text-blue-300 font-bold tracking-widest">Work From Home</div>
              <button onClick={() => navigate('/apply-wfh')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors">
                <span className="text-lg">➕</span> <span className="ml-3">Apply WFH</span>
              </button>
              <button onClick={() => navigate('/wfh-history')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors">
                <span className="text-lg">📊</span> <span className="ml-3">My WFH history</span>
              </button>

              <div className="pt-6 pb-1 px-4 text-[10px] uppercase text-blue-300 font-bold tracking-widest">Leaves</div>
              <button onClick={() => navigate('/apply-leave')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors">
                <span className="text-lg">➕</span> <span className="ml-3">Apply Leave</span>
              </button>
              <button onClick={() => navigate('/leave-history')} className="w-full flex items-center px-4 py-3 text-sm hover:bg-[#3C78D8] rounded transition-colors">
                <span className="text-lg">📊</span> <span className="ml-3">My Leave history</span>
              </button>
            </>
          )}
        </nav>

        {/* Logout at bottom */}
        <div className="absolute bottom-5 w-full px-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm bg-[#E53E3E] hover:bg-red-700 text-white rounded-lg transition-colors font-bold shadow-lg"
          >
            <span>🚪</span> <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 md:px-10 border-b border-gray-100">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-[#1C4587] text-2xl">☰</button>
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Dashboard Overview</h2>

          <div className="flex items-center">
             {/* Correct Gold Badge logic using actual Name */}
            <div className="bg-[#FFD966] text-[#1C4587] px-5 py-1.5 rounded-full text-xs font-extrabold shadow-sm border border-[#EAC75D]">
              {userName} / {role}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome, {userName}!</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your professional tasks and requests from here.</p>
          </div>

          {/* Centered Logo and Text Card (Matches Screenshot exactly) */}
          <div className="bg-white rounded-2xl p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center">
            <div className="mb-8">
                <h2 className="text-4xl font-black text-[#1C4587] tracking-tighter uppercase italic">WorkBuddy</h2>
                <div className="w-16 h-1 bg-[#FFD966] mx-auto mt-2 rounded-full"></div>
            </div>

            <div className="max-w-2xl text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-8">
              Success at work is a journey, and the first step is managing your tasks effectively. 
              Our platform offers a seamless management process, helping you stay organized and focused. 
              Start today and get one step closer to achieving your work goals.
            </div>
          </div>

          {/* Professional Dark Footer */}
          <footer className="mt-12 bg-[#1A202C] text-white p-10 rounded-2xl text-center shadow-inner">
            <h3 className="text-lg font-bold mb-3 tracking-wide">Contact Us</h3>
            <div className="space-y-1 opacity-70 text-xs">
              <p>Email: example@example.com</p>
              <p>Phone: 123-456-7890</p>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;