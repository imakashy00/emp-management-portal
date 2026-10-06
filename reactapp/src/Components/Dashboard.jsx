import { Plus } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom'; // 1. Import this hook
import EmployeeDashboard from '../EmployeeComponents/EmployeeDashboard';
import ManagerDashboard from '../ManagerComponents/ManagerDashboard';


const Dashboard = () => {
  const { userName, role } = useOutletContext();
  const navigate = useNavigate();
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
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm" onClick={() => navigate('/apply-leave')}>
              <Plus size={18} /> Apply Leave
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm" onClick={() => navigate('/apply-wfh')}>
              <Plus size={18} /> Request WFH
            </button>
          </div>
        }
      </div>
      {role === 'employee' ? (
        <EmployeeDashboard />
      ) : role === 'manager' ? (
        <ManagerDashboard />
      ) : (
        <div>Unauthorized</div>
      )}    </div>
  );
}


export default Dashboard;