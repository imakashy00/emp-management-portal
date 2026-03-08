
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Search, ChevronLeft, ChevronRight, Loader2, Inbox } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig';

const WfhRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Debounce logic: Update debouncedSearch after 500ms of no typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 when searching
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // 2. Fetch data when filters or page changes
  useEffect(() => {
    fetchWfhRequests();
  }, [page, statusFilter, debouncedSearch]);

  const fetchWfhRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
      });

      const res = await axios.get(`${API.GET_ALL_WFH}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API.UPDATE_WFH_STATUS}/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Request ${newStatus}`);
      fetchWfhRequests();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans antialiased text-gray-900">
      <Toaster position="top-center" />

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">WFH Management</h1>
        <p className="text-sm text-gray-500 mt-1">Review and synchronize remote work requests</p>
      </div>

      {/* Control Bar: Real-time search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 my-3 items-center justify-between border-b border-gray-100 pb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or reason..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-gray-200 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="w-full sm:w-44 px-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm outline-none focus:ring-1 focus:ring-gray-200 cursor-pointer appearance-none transition-all"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses </option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px] my-3">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-widest">
              <th className="pb-4">Employee</th>
              <th className="pb-4">Timeline</th>
              <th className="pb-4">Reason</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-24 text-center">
                  <Loader2 className="animate-spin inline-block text-gray-300" size={24} />
                </td>
              </tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="text-sm font-medium text-gray-700">{req.employeeId?.userName}</div>
                    <div className="text-[11px] text-gray-400">{req.employeeId?.email}</div>
                  </td>
                  <td className="py-5 text-xs text-gray-500 font-mono">
                    {new Date(req.startDate).toLocaleDateString('en-GB')} — {new Date(req.endDate).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-5">
                    <p className="text-sm text-gray-600 truncate max-w-xs" title={req.reason}>
                      {req.reason}
                    </p>
                  </td>
                  <td className="py-5">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase ${req.status === 'Approved' ? 'text-green-600 bg-green-50' :
                        req.status === 'Rejected' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'
                      }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-5 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleAction(req._id, 'Approved')}
                          className="text-gray-300 hover:text-green-600 transition-colors duration-200"
                          title="Approve"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => handleAction(req._id, 'Rejected')}
                          className="text-gray-300 hover:text-red-600 transition-colors duration-200"
                          title="Reject"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-300 font-medium italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-24 text-center text-gray-400 text-sm">
                  <Inbox className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  No results found for your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-8">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="text-gray-300 hover:text-gray-900 disabled:opacity-10 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="text-gray-300 hover:text-gray-900 disabled:opacity-10 transition-all"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WfhRequest;