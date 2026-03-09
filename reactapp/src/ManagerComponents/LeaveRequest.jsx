
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Info, Check, X, ChevronLeft, ChevronRight, Loader2, Inbox, FileText } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig';

const LeaveRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Debounce Logic: 500ms delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetch Logic
  useEffect(() => {
    fetchLeaves();
  }, [page, statusFilter, debouncedSearch]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API.GET_ALL_LEAVES, {
        params: { page, search: debouncedSearch, status: statusFilter, limit: 10 },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data.data || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      toast.error("Network error: Could not load leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API.UPDATE_LEAVE_STATUS}/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Request ${status}`);
      fetchLeaves();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans antialiased text-gray-900">
      <Toaster position="top-center" />

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Leave Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage employee absence requests</p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 my-3 items-center justify-between border-b border-gray-100 pb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employee..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-gray-200 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="w-full sm:w-44 px-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm outline-none focus:ring-1 focus:ring-gray-200 cursor-pointer appearance-none transition-all"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="min-h-[400px] my-3">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-widest">
              <th className="pb-4">Employee</th>
              <th className="pb-4">Type & Duration</th>
              <th className="pb-4">Reason</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="py-24 text-center"><Loader2 className="animate-spin inline-block text-gray-300" size={24} /></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="text-sm font-medium text-gray-700">{req.employeeId?.userName}</div>
                    <div className="text-[11px] text-gray-400">{req.employeeId?.email}</div>
                  </td>
                  <td className="py-5">
                    <div className="text-xs text-gray-700 font-medium">{req.leaveType}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(req.startDate).toLocaleDateString('en-GB')} - {new Date(req.endDate).toLocaleDateString('en-GB')}
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-sm text-gray-500 truncate max-w-[180px]" title={req.reason}>{req.reason}</p>
                  </td>
                  <td className="py-5">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase ${req.status === 'Approved' ? 'text-green-600 bg-green-50' :
                        req.status === 'Rejected' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'
                      }`}>{req.status}</span>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex justify-end gap-4">
                      <button onClick={() => setSelectedReq(req)} className="text-blue-500 " title="View Details">
                        <Info size={18} />
                      </button>
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="text-green-600 " title="Approve">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="text-red-600 " title="Reject">
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-24 text-center text-gray-400 text-sm"><Inbox className="w-10 h-10 mx-auto mb-3 opacity-20" /> No requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-8">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Page {page} of {totalPages}</p>
        <div className="flex gap-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="text-gray-300 hover:text-gray-900 disabled:opacity-10 transition-all">
            <ChevronLeft size={22} />
          </button>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="text-gray-300 hover:text-gray-900 disabled:opacity-10 transition-all">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedReq.employeeId?.userName}</h3>
                  <p className="text-xs text-gray-400">{selectedReq.employeeId?.email}</p>
                </div>
                <button onClick={() => setSelectedReq(null)} className="text-gray-300 hover:text-gray-800"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-300 uppercase">Type</p>
                    <p className="text-sm font-medium text-gray-700">{selectedReq.leaveType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-300 uppercase">Status</p>
                    <p className="text-sm font-medium text-gray-700">{selectedReq.status}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-300 uppercase">Reason</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedReq.reason}</p>
                </div>

                {selectedReq.file && (
                  <a
                    href={`${API.BASE_URL}/uploads/${selectedReq.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-500 font-medium pt-2 hover:underline"
                  >
                    <FileText size={14} /> Attached Document
                  </a>
                )}
              </div>

              <button onClick={() => setSelectedReq(null)} className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;