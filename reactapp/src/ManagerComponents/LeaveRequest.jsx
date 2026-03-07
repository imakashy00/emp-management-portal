import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, CheckCircle, XCircle, Info, ChevronLeft, ChevronRight, Loader2, AlertCircle, Calendar, User, FileText, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig';

const LeaveRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReq, setSelectedReq] = useState(null); // For "Show More" Modal

  // 1. Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 600);
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
        params: { page, search: debouncedSearch, status: statusFilter, limit: 6 },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data.data || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      toast.error("Failed to load leave requests");
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
      toast.success(`Request marked as ${status}`);
      fetchLeaves();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pt-2 pb-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1C4587]">Leave Approval Portal</h2>
          <p className="text-gray-500 text-sm font-medium">Review employee absence requests</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by username or reason..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-gray-100">
            <tr className="text-[#1C4587] text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="hover:bg-blue-50/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{req.employeeId?.userName}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{req.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{req.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => setSelectedReq(req)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white" title="Show More">
                        <Info size={18} />
                    </button>
                    {req.status === 'Pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-600 hover:text-white"><CheckCircle size={18}/></button>
                        <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white"><XCircle size={18}/></button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-20 text-center text-gray-400">No requests found</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 border rounded bg-white disabled:opacity-50"><ChevronLeft size={16}/></button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border rounded bg-white disabled:opacity-50"><ChevronRight size={16}/></button>
            </div>
        </div>
      </div>

      {/* "Show More" Modal Overlay */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="bg-[#1C4587] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Request Details</h3>
              <button onClick={() => setSelectedReq(null)} className="p-1 hover:bg-white/20 rounded-full"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1C4587] font-black">{selectedReq.employeeId?.userName?.charAt(0)}</div>
                <div>
                  <p className="font-bold text-gray-800">{selectedReq.employeeId?.userName}</p>
                  <p className="text-xs text-gray-500">{selectedReq.employeeId?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 border rounded-xl">
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Leave Type</p>
                  <p className="font-semibold text-gray-700">{selectedReq.leaveType}</p>
                </div>
                <div className="p-3 border rounded-xl">
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Mobile</p>
                  <p className="font-semibold text-gray-700">{selectedReq.employeeId?.mobile || "N/A"}</p>
                </div>
              </div>
              <div className="p-3 border rounded-xl">
                <p className="text-gray-400 text-[10px] font-bold uppercase">Full Reason</p>
                <p className="text-gray-600 leading-relaxed">{selectedReq.reason}</p>
              </div>
              {selectedReq.file && (
                <a 
                  href={`${API.BASE_URL}/uploads/${selectedReq.file}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 rounded-xl text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                >
                  <FileText size={18}/> View Attached Document
                </a>
              )}
            </div>
            <div className="p-6 pt-0">
               <button onClick={() => setSelectedReq(null)} className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold">Close Detail</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;