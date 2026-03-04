import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

function App() {
  return (
    <Router>
      {/* Minimal layout routes to make navigation coherent with tests */}
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/error" element={<ErrorPage />} />

        {/* Employee area */}
        <Route
          path="/employee"
          element={
            <div>
              <EmployeeNavbar />
              <div style={{ marginTop: 16 }}>
                <HomePage />
              </div>
            </div>
          }
        />
        <Route
          path="/leave"
          element={
            <div>
              <EmployeeNavbar />
              <div style={{ marginTop: 16 }}>
                <LeaveForm />
              </div>
            </div>
          }
        />
        <Route
          path="/wfh"
          element={
            <div>
              <EmployeeNavbar />
              <div style={{ marginTop: 16 }}>
                <WfhForm />
              </div>
            </div>
          }
        />
        <Route
          path="/view-leave"
          element={
            <div>
              <EmployeeNavbar />
              <div style={{ marginTop: 16 }}>
                <ViewLeave />
              </div>
            </div>
          }
        />
        <Route
          path="/view-wfh"
          element={
            <div>
              <EmployeeNavbar />
              <div style={{ marginTop: 16 }}>
                <ViewWfh />
              </div>
            </div>
          }
        />

        {/* Manager area */}
        <Route
          path="/manager"
          element={
            <div>
              <ManagerNavbar />
              <div style={{ marginTop: 16 }}>
                <HomePage />
              </div>
            </div>
          }
        />
        <Route
          path="/leave-requests"
          element={
            <div>
              <ManagerNavbar />
              <div style={{ marginTop: 16 }}>
                <LeaveRequest />
              </div>
            </div>
          }
        />
        <Route
          path="/wfh-requests"
          element={
            <div>
              <ManagerNavbar />
              <div style={{ marginTop: 16 }}>
                <WfhRequest />
              </div>
            </div>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </Router>
  );
}

export default App;



// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Signup from './Components/Signup';
// import Login from './Components/Login';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/signup" element={<Signup/>} />
//         <Route path="/login" element={<Login/>} />
//         <Route path="/" element={<Navigate to="/login" />} />
//         {/* Add Home route later */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;