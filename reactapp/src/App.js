import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { publicRoutes, protectedRoutes } from './config/routeConfig.js';
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from './routing/ProtectedRoutes.jsx';
import Profile from '../src/Pages/Profile.jsx'; // 1. IMPORT YOUR NEW PROFILE PAGE

const App = () => (
  <BrowserRouter>
    <ToastContainer position="top-right" autoClose={2000} hideProgressBar={true} />
    <Routes>
      {/* Public Routes (Login, Signup, Forgot Password) */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Protected Layout Routes (Side-Nav Dashboard) */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['employee', 'manager']}>
          <Dashboard />
        </ProtectedRoute>
      }>
        {/* 
            2. ADD PROFILE ROUTE MANUALLY 
            This ensures it renders inside the Dashboard Outlet
        */}
        <Route path="profile" element={
          <ProtectedRoute allowedRoles={['employee', 'manager']}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* All these children will render inside Dashboard's <Outlet /> */}
        {protectedRoutes.map(({ path, element, roles }) => (
          <Route
            key={path}
            index={path === ''} 
            path={path}
            element={
              <ProtectedRoute allowedRoles={roles}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Fallback to login if route doesn't exist */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;