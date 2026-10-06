
import axios from 'axios';
import { AlertTriangle, Edit3, Loader2, Lock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../Components/FilterBar';
import Pagination from '../Components/Pagination';
import API from '../apiConfig';
import { useTableData } from '../hooks/useTableData';

const ViewWfh = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { data: requests, loading, filters, updateFilter, totalPages, refresh } =
    useTableData(`${API.WFH}/${userId}`, { limit: 5 });

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`${API.WFH}/${deleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("WFH request removed");
      setDeleteId(null);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-2">
      <Toaster position="top-center" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">WFH History</h1>
        <button
          onClick={() => navigate('/apply-wfh')}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      <FilterBar filters={filters} onFilterChange={updateFilter} />

      <div className="min-h-[400px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-400 text-[11px] font-semibold uppercase border-b border-gray-50">
              <th className="pb-4">Duration</th>
              <th className="pb-4">Reason</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="py-24 text-center"><Loader2 className="animate-spin inline-block text-blue-200" /></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 text-sm text-gray-700">
                    <div className="font-medium">Remote Work</div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-5 text-sm text-gray-500 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                  <td className="py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${req.status === 'Approved' ? 'bg-green-50 text-green-600' :
                      req.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                      }`}>{req.status}</span>
                  </td>
                  <td className="py-5 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-3">
                        <button onClick={() => navigate('/apply-wfh', { state: { editData: req } })} className="text-blue-500 hover:text-blue-700 transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => setDeleteId(req._id)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    ) : <Lock size={14} className="ml-auto text-gray-200" />}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="py-24 text-center text-gray-300">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        filters={filters}
        totalPages={totalPages}
        onPageChange={(newPage) => updateFilter('page', newPage)}
      />

      {/* DELETE confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-2xl max-w-xs w-full text-center space-y-6 animate-in zoom-in duration-200">
            <div className="flex justify-center">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertTriangle className="text-red-600" size={28} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Discard Request?</h3>
              <p className="text-xs text-slate-500 mt-2">Are you sure you want to delete this remote work application? This action cannot be undone.</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="w-full py-2.5 bg-red-600 text-white font-medium rounded-xl text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={16} /> : null}
                {isDeleting ? 'Processing...' : 'Delete Permanently'}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="w-full py-2.5 bg-slate-50 text-slate-600 font-medium rounded-xl text-sm hover:bg-slate-100 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewWfh;