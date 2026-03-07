import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, Search, PlusCircle } from 'lucide-react';

const ViewLeave = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 5;
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchRequests(); }, [currentPage, searchTerm]);

  const fetchRequests = async () => {
    try {
      const employeeId = localStorage.getItem('userId');
      const url = `${API.GET_LEAVE_BY_USER}/${employeeId}?page=${currentPage}&limit=${limit}&search=${searchTerm}`;
      const response = await axios.get(url);
      
      // Robust check for paginated object vs flat array
      if (response.data && response.data.data) {
        setRequests(response.data.data);
        setTotalPages(response.data.pages || 1);
        setTotalRecords(response.data.total || 0);
      } else {
        setRequests(response.data);
        setTotalPages(1);
      }
    } catch (err) { toast.error("Failed to load history"); }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API.DELETE_LEAVE}/${deleteId}`);
      toast.success("Deleted!");
      setDeleteId(null);
      fetchRequests();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="p-8 bg-[#f4f7f6] min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-xl font-bold text-[#1C4587] uppercase tracking-wider">My Leave History</h2>
          <button onClick={() => navigate('/apply-leave')} className="bg-[#1C4587] text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-md">
            <PlusCircle size={14} /> APPLY NEW LEAVE
          </button>
        </div>

        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search by Reason..." className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full text-sm font-normal outline-none focus:border-[#3C78D8]" onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1C4587] text-white text-[11px] uppercase tracking-widest">
                <th className="p-4">S.No</th>
                <th className="p-4">Type</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-gray-400 italic">No records found.</td></tr>
              ) : (
                requests.map((req, index) => (
                  <tr key={req._id} className="text-sm font-normal hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-400">{(currentPage - 1) * limit + (index + 1)}</td>
                    <td className="p-4 font-bold text-[#1C4587]">{req.leaveType}</td>
                    <td className="p-4 text-gray-600 font-normal">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{req.status}</span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      {req.status === 'Pending' ? (
                        <>
                          <button onClick={() => navigate('/apply-leave', { state: { editData: req } })} className="text-blue-500 font-bold text-[11px] hover:underline">Edit</button>
                          <button onClick={() => setDeleteId(req._id)} className="text-red-500 font-bold text-[11px] hover:underline ml-2">Delete</button>
                        </>
                      ) : <span className="text-gray-300 italic text-[11px]">Finalized</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t pt-6 bg-white">
            <p className="text-xs text-gray-500 font-medium">Showing page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border rounded-lg disabled:opacity-30"><ChevronLeft size={18} /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border rounded-lg disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLeave;