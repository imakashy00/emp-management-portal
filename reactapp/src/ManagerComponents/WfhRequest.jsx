import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Search, Filter, ChevronLeft, ChevronRight, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig';

const WfhRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ pending: 0, total: 0 });

  useEffect(() => {
    fetchWfhRequests();
  }, [page, statusFilter]); // Refetch when page or status changes

  const fetchWfhRequests = async (isSearch = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Construct query params
      const params = new URLSearchParams({
        page: isSearch ? 1 : page,
        limit: 8,
        search: search,
        status: statusFilter,
        sortBy: 'status', // Sorting by status primarily
        sortOrder: 'desc'
      });

      const response = await axios.get(`${API.GET_ALL_WFH}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { data, total, pages } = response.data;
      setRequests(data || []);
      setTotalPages(pages || 1);
      if(isSearch) setPage(1);

      // Simple stats (note: this only counts visible page, for real stats backend should provide them)
      setStats({
        pending: data.filter(r => r.status === 'Pending').length,
        total: total
      });

    } catch (error) {
      toast.error("Failed to load WFH requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API.UPDATE_WFH_STATUS}/${id}/status`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Request ${newStatus}`);
      fetchWfhRequests(); 
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-4">
      <Toaster position="top-right" />

      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1C4587]">WFH Approval Portal</h2>
          <p className="text-gray-500 text-sm">Manage employee remote work requests</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-[10px] uppercase font-bold text-amber-600">Active Pending</p>
            <p className="text-xl font-black text-amber-700">{stats.pending}</p>
          </div>
          <div className="text-center px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[10px] uppercase font-bold text-blue-600">Total Records</p>
            <p className="text-xl font-black text-blue-700">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search name or reason..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWfhRequests(true)}
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <select 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button 
          onClick={() => fetchWfhRequests(true)}
          className="bg-[#1C4587] text-white font-bold py-2 rounded-lg hover:bg-[#153466] transition-all"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-[#1C4587] text-xs font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-blue-600" /></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="hover:bg-blue-50/10">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{req.employeeId?.userName}</div>
                    <div className="text-[10px] text-gray-400">{req.employeeId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 truncate max-w-[200px]" title={req.reason}>
                      {req.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleStatusChange(req._id, 'Approved')} className="p-1.5 text-green-600 bg-green-50 rounded hover:bg-green-600 hover:text-white transition-all"><CheckCircle size={18}/></button>
                        <button onClick={() => handleStatusChange(req._id, 'Rejected')} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-600 hover:text-white transition-all"><XCircle size={18}/></button>
                      </div>
                    ) : <span className="text-[10px] text-gray-300 italic">Processed</span>}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-20 text-center text-gray-400"><AlertCircle className="mx-auto mb-2" /> No requests found</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="p-2 border rounded bg-white disabled:opacity-50"
            >
              <ChevronLeft size={16}/>
            </button>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="p-2 border rounded bg-white disabled:opacity-50"
            >
              <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WfhRequest;