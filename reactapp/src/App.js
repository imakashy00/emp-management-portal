import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { publicRoutes, protectedRoutes } from './config/routeConfig.js';
import Dashboard from "./Pages/Home.jsx";
import ProtectedRoute from './routing/ProtectedRoutes.jsx';

const App = () => (
  <BrowserRouter>
    <ToastContainer position="top-right" autoClose={2000} hideProgressBar={true} />
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* --- PROTECTED LAYOUT --- */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['employee', 'manager']}>
          <Dashboard />
        </ProtectedRoute>
      }>
        {/* DYNAMIC ROUTES (WFH, Leave, etc.) */}
        {protectedRoutes.map(({ path, element, roles }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedRoles={roles}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* --- CATCH ALL --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;