import React from 'react';
import EmployeeDashboard from '../EmployeeComponents/EmployeeDashboard';
import { useOutletContext } from 'react-router-dom'; // 1. Import this hook
import ManagerDashboard from '../ManagerComponents/ManagerDashboard';
import { Plus } from 'lucide-react';


const Dashboard = () => {
  const { userName, role } = useOutletContext();
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>

          <h3 className="text-xl font-bold text-gray-800 tracking-tight">Welcome, {userName}!</h3>
          <p className="text-gray-500 text-xs mt-1">
            Manage your professional tasks and requests from here.
          </p>
        </div>
        {role === 'employee' &&
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#1C4587] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm">
              <Plus size={18} /> Apply Leave
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
              <Plus size={18} /> Request WFH
            </button>
          </div>
        }
      </div>
      {role === 'employee' ? <EmployeeDashboard /> : <ManagerDashboard />}
    </div>
  );
}


export default Dashboard;