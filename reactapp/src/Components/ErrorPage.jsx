
// import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  // Optionally check user role to redirect them to the correct home
  const handleGoHome = () => {
    const role = localStorage.getItem('userRole');
    if (role === 'manager') navigate('/manager');
    else if (role === 'employee') navigate('/employee');
    else navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-light)] px-4">

      <div className="bg-white p-10 rounded-xl shadow-lg border border-[var(--border-color)] flex flex-col items-center max-w-md w-full">

        {/* Title using  --danger color */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--danger)] text-center mb-3">
          Oops! Something Went Wrong
        </h1>

        <p className="text-[var(--text-muted)] text-center mb-8 text-sm sm:text-base">
          Please try again later.
        </p>


        <svg
          className="w-32 h-32 text-[var(--text-main)] mb-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <button
          onClick={handleGoHome}
          className="px-6 py-2.5 rounded-md font-semibold text-white transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-md bg-[var(--primary-blue)] hover:bg-[var(--secondary-blue)] active:scale-95"
        >
          Go Back Home
        </button>

      </div>
    </div>
  );
};

export default ErrorPage;