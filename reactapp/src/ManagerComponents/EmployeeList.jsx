
import React from 'react';
import { Shield, Mail, Phone, Loader2, Inbox } from 'lucide-react';
import { useTableData } from '../hooks/useTableData';
import FilterBar from '../Components/FilterBar';
import API from '../apiConfig';
import Pagination from '../Components/Pagination'; // Suggested reusable component

const EmployeeList = () => {
  const { data: employees, loading, filters, totalPages, totalItems, updateFilter } =
    useTableData(API.GET_EMPLOYEES);

  return (
    <div className="max-w-6xl mx-auto font-sans antialiased text-gray-900 pt-2">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Employee Directory</h1>
          <p className="text-sm text-gray-500">Manage team member profiles</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Staff</p>
          <p className="text-lg font-semibold text-blue-600">{totalItems}</p>
        </div>
      </div>

      <FilterBar filters={filters} onFilterChange={updateFilter} showStatus={false} showDates={false} />

      <div className="min-h-[400px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-widest">
              <th className="pb-4">Employee</th>
              <th className="pb-4">Contact Information</th>
              <th className="pb-4 text-right">Access Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="3" className="py-24 text-center"><Loader2 className="animate-spin inline-block text-gray-300" /></td></tr>
            ) : employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id} className="group hover:bg-gray-50/50">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                        {emp.userName?.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{emp.userName}</span>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500"><Mail size={12} /> {emp.email}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500"><Phone size={12} /> {emp.mobile || 'No mobile'}</div>
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                      <Shield size={10} className="inline mr-1" /> {emp.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="py-24 text-center text-gray-400"><Inbox className="mx-auto mb-2 opacity-20" /> No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination filters={filters} totalPages={totalPages} onPageChange={(p) => updateFilter('page', p)} />
    </div>
  );
};

export default EmployeeList;