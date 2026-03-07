import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Shield, AlertCircle, Loader2, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0
  });

  // Backend Logic: Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); 
    }, 600);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Backend Logic: Fetching
  useEffect(() => {
    const getEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API.GET_EMPLOYEES, {
          params: {
            page: currentPage,
            limit: 4, 
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
        toast.error("Failed to load employee list");
      } finally {
        setLoading(false);
      }
    };
    getEmployees();
  }, [currentPage, debouncedSearch]);

  return (
    /* h-full and flex flex-col justify-start forces the content to stay at the top */
    <div className="w-full h-full flex flex-col justify-start items-stretch px-6 pt-2 pb-6 space-y-4">
      <Toaster position="top-right" />

      {/* Header Section - Same as WFH Portal */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto">
          <h2 className="text-2xl font-extrabold text-[#1C4587]">Employee Directory</h2>
          <p className="text-gray-500 text-sm font-medium">Manage and view staff profiles</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 font-bold text-xs">
            Total Staff: {pagination.totalItems}
          </div>
        </div>
      </div>

      {/* Filter Section - Consistent with WFH Portal */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="bg-[#1C4587] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#153466] transition-all text-sm whitespace-nowrap"
          disabled={loading}
        >
          Apply Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex-grow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8fafc] border-b border-gray-100">
              <tr className="text-[#1C4587] text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Employee</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5">Mobile</th>
                <th className="px-8 py-5 text-right">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Updating...</span>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1C4587] text-white flex items-center justify-center font-bold">
                          {emp.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-gray-800">{emp.userName}</div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-300" />
                        {emp.email}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                         <Phone className="w-4 h-4 text-gray-300" />
                         {emp.mobile || "N/A"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#1C4587] text-[10px] font-black uppercase rounded border border-blue-100">
                        <Shield className="w-3 h-3" /> {emp.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <AlertCircle className="mx-auto mb-2 w-10 h-10 text-gray-200" /> 
                    <p className="text-gray-400 font-bold">No employees found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section - Consistent Icon buttons */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1 || loading} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={currentPage >= pagination.totalPages || loading} 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;