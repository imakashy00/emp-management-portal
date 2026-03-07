import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { publicRoutes, protectedRoutes } from './config/routeConfig.js';
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from './routing/ProtectedRoutes.jsx';
import Profile from './Pages/Profile';
import HomePage from './Components/HomePage'; // Ensure this is imported

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
        
        {/* 
           FIX 1: Explicitly map 'home' and the base index.
           This stops the redirect to /login when clicking 'Dashboard'.
        */}
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        
        {/* FIX 2: Explicit Profile route */}
        <Route path="profile" element={<Profile />} />

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
      {/* 
          If you are getting redirected to login, it's because 
          the route you clicked didn't match anything above.
      */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;