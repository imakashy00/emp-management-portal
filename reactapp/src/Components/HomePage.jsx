import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Mock user data - in a real app, this would come from your Auth state/context
  const user = {
    name: "emp2",
    role: "Employee"
  };

  const handleLogout = () => {
    // Show confirmation modal logic would go here
    if (window.confirm("Are you sure you want to logout?")) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f6] font-['Segoe_UI',sans-serif]">
      
      {/* Navigation Bar - Ref: Page 23 & 29 */}
      <nav className="bg-gradient-to-r from-[#1C4587] to-[#3C78D8] px-6 md:px-12 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="text-white font-bold text-xl tracking-wider">
          WORKBUDDY
        </div>
        
        <div className="flex items-center space-x-6">
          {/* User Badge - Ref: Page 29 */}
          <div className="hidden md:block bg-[#FFD966] text-[#333] px-4 py-1 rounded-full text-xs font-bold">
            {user.name} / {user.role}
          </div>
          
          <div className="flex space-x-4 text-white text-sm">
            <button onClick={() => navigate('/home')} className="hover:opacity-80 transition-opacity">Home</button>
            <button onClick={() => navigate('/wfh')} className="hover:opacity-80 transition-opacity">WFH</button>
            <button onClick={() => navigate('/leave')} className="hover:opacity-80 transition-opacity">Leave</button>
          </div>

          <button 
            onClick={handleLogout}
            className="bg-[#CC0000] hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area - Ref: Page 29 & 30 */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        
        {/* Branding Logo Area */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
             {/* Replace with your actual logo image if available */}
             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-3xl font-black text-[#1C4587]">WorkBuddy</h2>
                <div className="flex justify-center space-x-1 mt-1">
                   <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Welcome Text Card - Ref: Page 29 */}
        <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Success at work is a journey, and the first step is managing your tasks effectively. 
            Our platform offers a seamless task management process, helping you stay organized and focused. 
            Start managing your tasks today and get one step closer to achieving your work goals.
          </p>
        </div>
      </main>

      {/* Footer - Ref: Page 29 & 30 */}
      <footer className="bg-[#333333] text-white py-8 px-4 text-center">
        <h3 className="text-lg font-bold mb-4 border-b border-gray-600 inline-block pb-1">Contact Us</h3>
        <div className="space-y-1 text-sm opacity-80">
          <p>Email: example@example.com</p>
          <p>Phone: 123-456-7890</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;