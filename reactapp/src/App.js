import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Core Components
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';
import ErrorPage from './Components/ErrorPage';

// 2. Employee Specific Components
import EmployeeNavbar from './EmployeeComponents/EmployeeNavbar';
import LeaveForm from './EmployeeComponents/LeaveForm';
import ViewLeave from './EmployeeComponents/ViewLeave';
import ViewWfh from './EmployeeComponents/ViewWfh';
import WfhForm from './EmployeeComponents/WfhForm';

// 3. Manager Specific Components
import ManagerNavbar from './ManagerComponents/ManagerNavbar';
import EmployeeList from './ManagerComponents/EmployeeList';
import LeaveRequest from './ManagerComponents/LeaveRequest';
import WfhRequest from './ManagerComponents/WfhRequest';
import RegisterManager from './ManagerComponents/RegisterManager';

// ---------------------------------------------------------
// 1. Protected Route Wrapper (Handles Security & Roles)
// ---------------------------------------------------------
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("userRole")?.toLowerCase();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/error" replace />;
  }

  return children;
};

// ---------------------------------------------------------
// 2. Dynamic Navigation Component (Conditional Top Navbar)
// ---------------------------------------------------------
function Navigation() {
  const location = useLocation();
  const role = localStorage.getItem("userRole")?.toLowerCase();

  // Paths where the Navbar should NOT be displayed
  const noNavPaths = ['/', '/login', '/signup', '/error', '/forgot-password'];
  
  if (noNavPaths.includes(location.pathname)) {
    return null; 
  }

  // Show correct navbar based on role from localStorage
  if (role === "manager") return <ManagerNavbar />;
  if (role === "employee") return <EmployeeNavbar />;

  return null;
}

// ---------------------------------------------------------
// 3. Main App Component
// ---------------------------------------------------------
function App() {
  return (
    <Router>
      {/* Persists the correct navbar at the top of every protected page */}
      <Navigation />
      
      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/error" element={<ErrorPage />} />

        {/* --- SHARED PROTECTED ROUTES --- */}
        <Route path="/home" element={
          <ProtectedRoute allowedRoles={["employee", "manager"]}>
            <HomePage />
          </ProtectedRoute>
        } />

        {/* --- EMPLOYEE PROTECTED ROUTES (Ref: PDF Page 3) --- */}
        <Route path="/apply-wfh" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <WfhForm />
          </ProtectedRoute>
        } />
        <Route path="/wfh-history" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <ViewWfh />
          </ProtectedRoute>
        } />
        <Route path="/apply-leave" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <LeaveForm />
          </ProtectedRoute>
        } />
        <Route path="/leave-history" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <ViewLeave />
          </ProtectedRoute>
        } />

        {/* --- MANAGER PROTECTED ROUTES (Ref: PDF Page 3) --- */}
        <Route path="/employees" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <EmployeeList />
          </ProtectedRoute>
        } />
        <Route path="/manager/wfh" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <WfhRequest />
          </ProtectedRoute>
        } />
        <Route path="/manager/leave" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <LeaveRequest />
          </ProtectedRoute>
        } />
        <Route path="/invite-manager" element={ // NEW: Custom Option added
          <ProtectedRoute allowedRoles={["manager"]}>
            <RegisterManager />
          </ProtectedRoute>
        } />

        {/* --- FALLBACK ROUTE --- */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </Router>
  );
}

export default App;