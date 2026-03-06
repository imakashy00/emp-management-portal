import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { publicRoutes, protectedRoutes } from './config/routeConfig.js';
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from './routing/ProtectedRoutes.jsx';

const App = () => (
  <BrowserRouter>
    <ToastContainer position="top-right" autoClose={2000} hideProgressBar={true} />
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Protected Layout Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['employee', 'manager']}>
          <Dashboard />
        </ProtectedRoute>
      }>
        {/* All these children will render inside Dashboard's <Outlet /> */}
        {protectedRoutes.map(({ path, element, roles }) => (
          <Route
            key={path}
            index={path === ''} // This makes path: '' the default home
            path={path}
            element={
              <ProtectedRoute allowedRoles={roles}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;