import React from 'react';
import { Link } from 'react-router-dom';

export default function EmployeeNavbar() {
  return (
    <nav aria-label="Employee Navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/wfh">WFH</Link></li>
        <li><button type="button">Logout</button></li>
      </ul>
    </nav>
  );
}