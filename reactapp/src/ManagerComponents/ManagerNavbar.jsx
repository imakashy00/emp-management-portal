import React from 'react';
import { Link } from 'react-router-dom';

export default function ManagerNavbar() {
  return (
    <nav aria-label="Manager Navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/wfh-requests">WFH Request</Link></li>
        <li><button type="button">Logout</button></li>
      </ul>
    </nav>
  );
}