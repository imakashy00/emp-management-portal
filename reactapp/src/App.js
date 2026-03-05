// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Components
// import HomePage from './Components/HomePage';
// import Login from './Components/Login';
// import Signup from './Components/Signup';
// import ErrorPage from './Components/ErrorPage';

// // Employee
// import EmployeeNavbar from './EmployeeComponents/EmployeeNavbar';
// import LeaveForm from './EmployeeComponents/LeaveForm';
// import ViewLeave from './EmployeeComponents/ViewLeave';
// import ViewWfh from './EmployeeComponents/ViewWfh';
// import WfhForm from './EmployeeComponents/WfhForm';

// // Manager
// import ManagerNavbar from './ManagerComponents/ManagerNavbar';
// import LeaveRequest from './ManagerComponents/LeaveRequest';
// import WfhRequest from './ManagerComponents/WfhRequest';
// import RegisterManager from './ManagerComponents/RegisterManager';

// function App() {
//   return (
//     <Router>
//       {/* Minimal layout routes to make navigation coherent with tests */}
//       <Routes>
//         {/* Public pages */}
//         <Route path="/" element={<Login />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/error" element={<ErrorPage />} />

//         {/* Employee area */}
//         <Route
//           path="/employee"
//           element={
//             <div>
//               <EmployeeNavbar />
//               <div style={{ marginTop: 16 }}>
//                 <HomePage />
//               </div>
//             </div>
//           }
//         />
//         <Route
//           path="/leave"
//           element={
//             <div>
//               <EmployeeNavbar />
//               <div style={{ marginTop: 16 }}>
//                 <LeaveForm />
//               </div>
//             </div>
//           }
//         />
//         <Route
//           path="/wfh"
//           element={
//             <div>
//               <EmployeeNavbar />
//               <div style={{ marginTop: 16 }}>
//                 <WfhForm />
//               </div>
//             </div>
//           }
//         />
//         <Route
//           path="/view-leave"
//           element={
//             <div>
//               <EmployeeNavbar />
//               <div style={{ marginTop: 16 }}>
//                 <ViewLeave />
//               </div>
//             </div>
//           }
//         />
//         <Route
//           path="/view-wfh"
//           element={
//             <div>
//               <EmployeeNavbar />
//               <div style={{ marginTop: 16 }}>
//                 <ViewWfh />
//               </div>
//             </div>
//           }
//         />

//         {/* Manager area */}
//         <Route
//           path="/manager"
//           element={
//             <div>
//               <ManagerNavbar />
//               <div style={{ marginTop: 16 }}>
//                 <HomePage />
//               </div>
//             </div>
//           }
//         />
//         <Route
//           path="/leave-requests"
//           element={
//             <div>
//               <ManagerNavbar />
//               <div style={{ marginTop: 16 }}>
//                 <LeaveRequest />
//               </div>
//             </div>
//           }
//         />
//         <Route
//           path="/wfh-requests"
//           element={
//             <div>
//               <ManagerNavbar />
//               <div style={{ marginTop: 16 }}>
//                 <WfhRequest />
//               </div>
//             </div>
//           }
//         />
//         <Route
//           path="/register-manager"
//           element={
//             <div>

//                 <RegisterManager />

//             </div>
//           }
//         />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/error" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ErrorPage from './Components/ErrorPage';


// Employee
import EmployeeNavbar from './EmployeeComponents/EmployeeNavbar';
import LeaveForm from './EmployeeComponents/LeaveForm';
import ViewLeave from './EmployeeComponents/ViewLeave';
import ViewWfh from './EmployeeComponents/ViewWfh';
import WfhForm from './EmployeeComponents/WfhForm';

// Manager
import ManagerNavbar from './ManagerComponents/ManagerNavbar';
import LeaveRequest from './ManagerComponents/LeaveRequest';
import WfhRequest from './ManagerComponents/WfhRequest';
import RegisterManager from './ManagerComponents/RegisterManager';
import Dashboard from './Components/Dashboard';
import ForgotPassword from './Components/ForgotPassword';

// ---------------------------------------------------------
// 1. Protected Route Wrapper
// ---------------------------------------------------------
const ProtectedRoute = ({ children, allowedRoles, applyMargin = true }) => {
  // Fetch exactly "userRole" from local storage
  const role = localStorage.getItem("userRole");

  // If user is not logged in, send them to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but role doesn't match the allowed roles, send to error page
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/error" replace />;
  }

  // Return children wrapped with the margin styling (unless explicitly disabled)
  return applyMargin ? <div style={{ marginTop: 16 }}>{children}</div> : children;
};

// ---------------------------------------------------------
// 2. Dynamic Navigation Component
// ---------------------------------------------------------
function Navigation() {
  const location = useLocation();
  // Fetch exactly "userRole" from local storage
  const role = localStorage.getItem("userRole");

  // Paths where the Navbar should NOT be displayed
  const noNavPaths =['/', '/login', '/signup', '/error', '/home', '/register-manager'];
  
  if (noNavPaths.includes(location.pathname)) {
    return null; 
  }

  // Render the respective navbar based on the userRole
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
      <Navigation/>
       <>
      <ToastContainer position="top-right" autoClose={3000} />
     
    
      {/* Minimal layout routes to make navigation coherent with tests */}
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* EMPLOYEE PROTECTED ROUTES */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/leave" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <LeaveForm />
          </ProtectedRoute>
        } />
        <Route path="/wfh" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <WfhForm />
          </ProtectedRoute>
        } />
        <Route path="/view-leave" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <ViewLeave />
          </ProtectedRoute>
        } />
        <Route path="/view-wfh" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <ViewWfh />
          </ProtectedRoute>
        } />

        {/* MANAGER PROTECTED ROUTES */}
        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/leave-requests" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <LeaveRequest />
          </ProtectedRoute>
        } />
        <Route path="/wfh-requests" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <WfhRequest />
          </ProtectedRoute>
        } />
        
        {/* Register Manager: we set applyMargin={false} to keep it exactly like your original code */}
        <Route path="/register-manager" element={
          <ProtectedRoute allowedRoles={["manager"]} applyMargin={false}>
            <Signup/>
          </ProtectedRoute>
        } />

        {/* FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
      </>
    </Router>
  );
}

export default App;