import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, Mail, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig'; // Importing your custom API config

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API.GET_EMPLOYEES);
      // Assuming your backend returns an array of users with role 'employee'
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load employee directory");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("PERMANENT ACTION: Are you sure you want to delete this employee account?")) return;
    
    try {
      // Use the GET_EMPLOYEES path and append the ID for the DELETE request
      // This ensures we stay consistent with your apiConfig.js
      const response = await axios.delete(`${API.GET_EMPLOYEES}/${id}`);
      
      if (response.status === 200 || response.status === 204) {
        toast.success("Employee removed successfully");
        fetchEmployees(); // Refresh the list from the server
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Could not delete user. Please try again.");
    }
  };

  // REAL-TIME SEARCH LOGIC
  const filteredEmployees = employees.filter(emp =>
    emp.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1C4587]">Employee Directory</h2>
          <p className="text-gray-500 text-sm font-medium">Manage and remove employee accounts</p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3C78D8] outline-none w-full md:w-80 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] border-b border-gray-100">
              <tr className="text-[#1C4587] text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Employee Name</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400 font-bold">
                      <Loader2 className="w-8 h-8 animate-spin text-[#3C78D8]" />
                      Loading Employees...
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-sm bg-gradient-to-br from-[#3C78D8] to-[#1C4587]">
                          {emp.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{emp.userName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 italic">
                            <Mail className="w-3 h-3" /> {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                        <Shield className="w-4 h-4 text-gray-300" />
                        <span className="capitalize">{emp.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {/* Delete Action */}
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="p-2.5 text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Delete Employee Permanently"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State / No Search Results */
                <tr>
                  <td colSpan="3" className="p-24 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">
                      {searchTerm ? `No results found for "${searchTerm}"` : "No Employees Found"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;