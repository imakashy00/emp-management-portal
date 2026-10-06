
import axios from 'axios';
import { Check, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FilterBar from '../Components/FilterBar';
import Pagination from '../Components/Pagination'; // 1. Import Pagination
import API from '../apiConfig';
import { useTableData } from '../hooks/useTableData';

const WfhRequest = () => {
  const { data: requests, loading, filters, totalPages, updateFilter, refresh } =
    useTableData(API.GET_ALL_WFH);

  const handleAction = async (id, status) => {
    try {
      await axios.patch(`${API.UPDATE_WFH_STATUS}/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`Request ${status}`);
      refresh();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-2">
      <h1 className="text-xl font-semibold text-gray-800">WFH Approvals</h1>
      <FilterBar filters={filters} onFilterChange={updateFilter} />

      <div className="min-h-[400px]">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-[11px] font-semibold uppercase border-b border-gray-50">
              <th className="pb-4">Employee</th>
              <th className="pb-4">Timeline</th>
              <th className="pb-4">Reason</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="py-24 text-center"><Loader2 className="animate-spin inline-block text-blue-300" /></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50/50">
                  <td className="py-5">
                    <div className="text-sm font-medium">{req.employeeId?.userName}</div>
                    <div className="text-[10px] text-gray-400">{req.employeeId?.email}</div>
                  </td>
                  <td className="py-5 text-xs text-gray-500 font-mono">
                    {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-5 text-sm text-gray-500 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                  <td className="py-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${req.status === 'Approved' ? 'bg-green-50 text-green-600' :
                      req.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                      }`}>{req.status}</span>
                  </td>
                  <td className="py-5 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-4">
                        <button onClick={() => handleAction(req._id, 'Approved')} className="text-green-600 hover:scale-110 transition-transform"><Check size={20} /></button>
                        <button onClick={() => handleAction(req._id, 'Rejected')} className="text-red-600 hover:scale-110 transition-transform"><X size={20} /></button>
                      </div>
                    ) : <span className="text-[10px] text-gray-300 italic">Processed</span>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-24 text-center text-gray-400 text-sm">No WFH requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 2. Add the Pagination component here */}
      <Pagination
        filters={filters}
        totalPages={totalPages}
        onPageChange={(page) => updateFilter('page', page)}
      />
    </div>
  );
};

export default WfhRequest;