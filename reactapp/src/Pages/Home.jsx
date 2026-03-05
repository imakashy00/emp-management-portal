import React from 'react';
import WelcomeCard from './NewComponents/Cards/WelcomeCard';

const Home = ({ userName }) => (
  <div>
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome, {userName}!</h1>
      <p className="text-gray-500 text-sm mt-1">
        Manage your professional tasks and requests from here.
      </p>
    </div>

    <WelcomeCard userName={userName} />
  </div>
);

export default Home;