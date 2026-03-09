
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Shield, Loader2, ChevronLeft, ChevronRight, Mail, Phone, Inbox } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  // 1. Debounce Logic: Update debouncedSearch 500ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetch Logic: Triggered by page change or debounced search change
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, debouncedSearch]);

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const response = await axios.get(API.GET_EMPLOYEES, {
        params: {
          page: currentPage,
          limit: 10,
          userName: debouncedSearch,
          sortBy: 'userName',
          order: 'asc'
        }, 
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success) {
        setEmployees(response.data.data || []);
        setPagination({
          totalPages: response.data.pagination?.totalPages || 1,
          totalItems: response.data.pagination?.totalItems || 0
        });
      }
    } catch (error) {
      toast.error("Unable to load directory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans antialiased text-gray-900">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Employee Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Browse and manage team member profiles</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Staff</p>
          <p className="text-lg font-semibold text-blue-600">{pagination.totalItems}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="border-b border-gray-100 pb-8 my-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-gray-200 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="min-h-[400px] my-3">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-widest">
              <th className="pb-4">Employee</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Mobile</th>
              <th className="pb-4 text-right">Access Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-24 text-center">
                  <Loader2 className="animate-spin inline-block text-gray-300" size={24} />
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                        {emp.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-medium text-gray-700">{emp.userName}</div>
                    </div>
                  </td>
                  <td className="py-5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-300" />
                      {emp.email}
                    </div>
                  </td>
                  <td className="py-5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-300" />
                      {emp.mobile || "—"}
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                      <Shield size={10} /> {emp.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-24 text-center text-gray-400 text-sm">
                  <Inbox className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  No employees found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-8">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
          Page {currentPage} of {pagination.totalPages}
        </p>
        <div className="flex gap-6">
          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="text-gray-300 hover:text-gray-900 disabled:opacity-10 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            disabled={currentPage >= pagination.totalPages || loading}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="text-gray-300 hover:text-gray-900 disabled:opacity-10 transition-all"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;