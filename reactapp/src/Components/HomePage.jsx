
import React from 'react';

const HomePage = () => {
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <div className="p-6 md:p-10 flex flex-col items-center bg-[#f4f7f6] min-h-screen font-['Segoe_UI',sans-serif]">
      {/* Welcome text */}
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {userName}!</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your professional tasks and requests from here.</p>
      </div>

      {/* Centered WorkBuddy Card (Ref: Page 29) */}
      <div className="bg-white w-full max-w-4xl rounded-lg p-12 shadow-sm border border-gray-100 flex flex-col items-center text-center mt-4">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-[#1C4587] tracking-tight uppercase italic">WorkBuddy</h2>
          <div className="w-16 h-1 bg-[#FFD966] mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="max-w-2xl text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-10">
          Success at work is a journey, and the first step is managing your tasks effectively. 
          Our platform offers a seamless management process, helping you stay organized and focused. 
          Start today and get one step closer to achieving your work goals.
        </div>
      </div>
    </div>
  );
};

export default HomePage;