import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar.jsx';

const Home = () => {
  const navigate = useNavigate();
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

  const isManager = role?.toLowerCase() === 'manager';

  return (
    <div className="flex h-screen bg-[var(--bg-light)] overflow-hidden">
      <Sidebar
        isOpen={isMobileMenuOpen}
        isManager={isManager}
        userName={userName}
        role={role}
        onNavigate={(path) => {
          navigate(path);
          setIsMobileMenuOpen(false);
        }}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <div className="flex-1 overflow-y-auto p-4 md:px-10 md:py-5 custom-scrollbar">
          {/* Outlet is where WfhForm, LeaveForm, etc., will be rendered */}
          <div className="min-h-[calc(100vh-180px)]">
            <Outlet context={{ userName, role }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;