import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout + top-level pages
import Dashboard from './Pages/Dashboard.jsx';
import Home from './Pages/Home.jsx';

// Employee pages
import ApplyWFH from './Pages/Employee/ApplyWFH.jsx';
import WFHHistory from './Pages/Employee/WFHHistory.jsx';
import ApplyLeave from './Pages/Employee/ApplyLeave.jsx';
import LeaveHistory from './Pages/Employee/LeaveHistory.jsx';

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
  return children;
};

// Minimal login placeholder
const Login = () => <div className="p-6">Login page placeholder</div>;

const App = () => (
  <BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected dashboard layout with nested routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['employee', 'manager']}>
            <Dashboard />
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
  </BrowserRouter>
);


export default App;