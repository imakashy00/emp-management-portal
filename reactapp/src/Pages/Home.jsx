import React from 'react';
import WelcomeCard from './NewComponents/Cards/WelcomeCard';
import { useOutletContext } from 'react-router-dom'; // 1. Import this hook


const Home = () => {
  const { userName, role } = useOutletContext();
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Welcome, {userName}!</h3>
        <p className="text-gray-500 text-xs mt-1">
          Manage your professional tasks and requests from here.
        </p>
      </div>
      <WelcomeCard userName={userName} />
    </div>
  );
}


export default Home;