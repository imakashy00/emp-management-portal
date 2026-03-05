import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WfhForm from './EmployeeComponents/WfhForm.jsx'
import ViewWfh from './EmployeeComponents/ViewWfh.jsx'
import LeaveForm from './EmployeeComponents/LeaveForm.jsx'
import ViewLeave from './EmployeeComponents/ViewLeave.jsx'

import Dashboard from './Pages/Dashboard.jsx';
import ProtectedRoute from './routing/ProtectedRoutes.jsx'

// 3. Manager Specific Components
import EmployeeList from './ManagerComponents/EmployeeList';
import LeaveRequest from './ManagerComponents/LeaveRequest';
import WfhRequest from './ManagerComponents/WfhRequest';
import RegisterManager from './ManagerComponents/RegisterManager';
import Login from './Components/Login.jsx';


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