import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, Shield, AlertCircle, Loader2, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search States
  const [searchTerm, setSearchTerm] = useState(''); // What user types
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Used for API
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0
  });

  // 1. DEBOUNCE LOGIC
  // This effect only runs when searchTerm changes. 
  // It waits 600ms before updating debouncedSearch.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 whenever user searches
    }, 600);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. FETCH LOGIC
  // This effect handles the API call. It ONLY runs when 
  // debouncedSearch or currentPage changes.
  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true);
        // Check Network Tab: This should only fire once after you stop typing
        const response = await axios.get(API.GET_EMPLOYEES, {
          params: {
            page: currentPage,
            limit: 3, // Change to 10 later; kept at 3 so you can test pagination with your data
            userName: debouncedSearch,
            sortBy: 'userName',
            order: 'asc'
          }
        });

        if (response.data?.success) {
          setEmployees(response.data.data || []);
          setPagination({
            totalPages: response.data.pagination?.totalPages || 1,
            totalItems: response.data.pagination?.totalItems || 0
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load employee list");
      } finally {
        setLoading(false);
      }
    };

    getEmployees();
  }, [currentPage, debouncedSearch]); // ONLY trigger when these change

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8 mb-10">
      <Toaster position="top-right" />

      {/* Header Section: Aligned Title and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-[#1C4587] tracking-tight">Employee Directory</h2>
          <p className="text-gray-500 text-sm font-medium">Manage and view staff profiles</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#3C78D8] transition-colors" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#3C78D8] outline-none transition-all shadow-inner text-gray-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] border-b border-gray-100">
              <tr className="text-[#1C4587] text-[11px] font-bold uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Name</th>
                <th className="px-10 py-6">Email Address</th>
                <th className="px-10 py-6">Mobile Number</th>
                <th className="px-10 py-6">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-[#3C78D8]" />
                      <span className="text-gray-400 font-bold text-sm">Updating records...</span>
                    </div>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-br from-[#3C78D8] to-[#1C4587] group-hover:scale-105 transition-transform">
                          {emp.userName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-800 text-lg">{emp.userName}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-300" /> {emp.email}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-300" /> {emp.mobile || "N/A"}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#3C78D8] text-xs font-bold uppercase rounded-full border border-blue-100">
                        <Shield className="w-3.5 h-3.5" /> {emp.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-32 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold text-lg">No Results Found</p>
                    <p className="text-gray-400 text-sm font-medium">Check your spelling or try a different name</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-semibold">
            Page <span className="text-gray-900 font-black">{currentPage}</span> of <span className="text-gray-900 font-black">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center gap-4">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-100 bg-white rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              disabled={currentPage >= pagination.totalPages || loading}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1C4587] rounded-2xl text-sm font-bold text-white hover:bg-[#153466] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/10"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;