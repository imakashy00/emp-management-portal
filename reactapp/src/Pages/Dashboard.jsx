import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

import Sidebar from './NewComponents/SideBarTemp/Sidebar.jsx'; 
import Header from './NewComponents/Header/Header.jsx';
import Home from './Home.jsx';
import AppFooter from './NewComponents/Footer/AppFooter.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');

    if (!userRole) {
      navigate('/login', { replace: true });
    } else {
      setRole(userRole);
      setUserName(storedName || 'User');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const isManager = role === 'Manager' || role === 'manager';
  const isHomeRoute = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className="flex h-screen bg-[#f4f7f6] font-['Segoe_UI',sans-serif]">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        isManager={isManager}
        onNavigate={(path) => {
          navigate(path);
          setIsMobileMenuOpen(false);
        }}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleMenu={() => setIsMobileMenuOpen((s) => !s)}
          userName={userName}
          role={role}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          {isHomeRoute ? <Home userName={userName} /> : <Outlet />}
          <AppFooter />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;