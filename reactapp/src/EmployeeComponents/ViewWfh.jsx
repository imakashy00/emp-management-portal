import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast, Toaster } from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Search, Plus, Lock, Trash2, Edit3, Loader2 } from 'lucide-react';

const ViewWfh = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const limit = 6;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRequests();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const employeeId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const url = `${API.WFH}/${employeeId}?page=${currentPage}&limit=${limit}&search=${searchTerm}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

      setRequests(response.data.data || []);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      toast.error("Failed to sync history");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API.WFH}/${deleteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Request removed");
      setDeleteId(null);
      fetchRequests();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans antialiased text-slate-900 pt-2">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">WFH History</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage your remote work applications</p>
        </div>
        <button
          onClick={() => navigate('/apply-wfh')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          <span>New Request</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-slate-100 pb-6 my-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by reason..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-blue-100 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="min-h-[400px] my-3">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-slate-400 text-[11px] font-semibold uppercase tracking-widest border-b border-slate-50">
              <th className="pb-4 font-semibold">Timeline</th>
              <th className="pb-4 font-semibold">Justification</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="4" className="py-24 text-center"><Loader2 className="animate-spin inline-block text-blue-200" size={24} /></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5">
                    <div className="text-sm font-medium text-slate-700">Work From Home</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {new Date(req.startDate).toLocaleDateString('en-GB')} — {new Date(req.endDate).toLocaleDateString('en-GB')}
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-sm text-slate-600 truncate max-w-xs" title={req.reason}>{req.reason}</p>
                  </td>
                  <td className="py-5">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase ${req.status === 'Approved' ? 'text-emerald-600 bg-emerald-50' :
                      req.status === 'Rejected' ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'
                      }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-5 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => navigate('/apply-wfh', { state: { editData: req } })}
                          className="text-blue-600 "
                          title="Edit Request"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(req._id)}
                          className="text-rose-600 "
                          title="Delete Request"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end text-slate-200" title="Locked">
                        <Lock size={16} />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-24 text-center text-slate-300 text-sm">
                  No records found in your history
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-8">
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="text-blue-600 "
          >
            <ChevronLeft size={22} />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="text-blue-600"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Minimal Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-2xl max-w-xs w-full text-center space-y-6 animate-in zoom-in duration-200">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Delete Request?</h3>
              <p className="text-xs text-slate-500 mt-2">This action is permanent and cannot be undone.</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={confirmDelete} className="w-full py-2.5 bg-rose-600 text-white font-medium rounded-xl text-sm hover:bg-rose-700 transition-all">Confirm Delete</button>
              <button onClick={() => setDeleteId(null)} className="w-full py-2.5 bg-slate-50 text-slate-600 font-medium rounded-xl text-sm hover:bg-slate-100 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewWfh;