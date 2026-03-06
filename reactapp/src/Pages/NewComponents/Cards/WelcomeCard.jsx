import React from 'react';
import { useOutletContext } from 'react-router-dom'; // 1. Import this hook

const WelcomeCard = ({ userName }) => (
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
);

export default WelcomeCard;
