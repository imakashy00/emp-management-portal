import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, Search, PlusCircle, Trash2, Edit3, Lock } from 'lucide-react';

const ViewWfh = () => {
  const navigate = useNavigate();
  
  // Data States
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination States (Ref: Matches ViewLeave logic)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 5; // Records per page

  // Delete Modal State
  const [deleteId, setDeleteId] = useState(null);

  // Fetch data whenever page or search term changes
  useEffect(() => {
    fetchRequests();
  }, [currentPage, searchTerm]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const employeeId = localStorage.getItem('userId');
      
      if (!token || !employeeId) return navigate('/login');

      // Build URL with query params for the backend pagination logic
      const url = `${API.GET_WFH_BY_USER}/${employeeId}?page=${currentPage}&limit=${limit}&search=${searchTerm}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Extract data from the paginated object { total, pages, data }
      if (response.data && response.data.data) {
        setRequests(response.data.data);
        setTotalPages(response.data.pages || 1);
        setTotalRecords(response.data.total || 0);
      } else {
        // Fallback for simple array
        setRequests(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load WFH history");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API.DELETE_WFH}/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("WFH Request Deleted!");
      setDeleteId(null);
      fetchRequests(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-8 bg-[#f4f7f6] min-h-screen font-['Segoe_UI',sans-serif]">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1C4587] uppercase tracking-wider">My WFH History</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Total: {totalRecords} Records</p>
          </div>
          <button 
            onClick={() => navigate('/apply-wfh')}
            className="bg-[#1C4587] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#3C78D8] transition-all flex items-center gap-2 shadow-md"
          >
            <PlusCircle size={14} /> APPLY NEW WFH
          </button>
        </div>

        {/* SEARCH BAR SECTION */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by Reason..." 
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full text-sm font-normal outline-none focus:border-[#3C78D8] transition-all shadow-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1C4587] text-white text-[11px] uppercase tracking-widest">
                <th className="p-4">S.No</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-gray-400 italic uppercase tracking-widest text-xs">No WFH records found</td></tr>
              ) : (
                requests.map((req, index) => (
                  <tr key={req._id} className="text-sm font-normal hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-400">{(currentPage - 1) * limit + (index + 1)}</td>
                    <td className="p-4 text-gray-600 font-medium">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 truncate max-w-[150px]" title={req.reason}>{req.reason}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                      }`}>{req.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-4">
                        {req.status === 'Pending' ? (
                          <>
                            <button onClick={() => navigate('/apply-wfh', { state: { editData: req } })} className="text-blue-500 hover:text-blue-700 font-black text-[10px] flex items-center gap-1 transition-all">
                              <Edit3 size={14}/> EDIT
                            </button>
                            <button onClick={() => setDeleteId(req._id)} className="text-red-500 hover:text-red-700 font-black text-[10px] flex items-center gap-1 transition-all">
                              <Trash2 size={14}/> DELETE
                            </button>
                          </>
                        ) : <span className="text-gray-300 italic text-[10px] flex items-center gap-1 font-bold"><Lock size={12}/> FINALIZED</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER (Ref: PDF Page 40) --- */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t pt-6 bg-white">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter italic">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-3">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-20 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft size={18} className="text-[#1C4587]" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-[#1C4587] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-20 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
              >
                <ChevronRight size={18} className="text-[#1C4587]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center border border-gray-100">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mt-2 mb-8 italic">This request will be permanently removed.</p>
            <div className="flex gap-4">
              <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-md uppercase text-xs tracking-widest">Yes, Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-bold transition-all uppercase text-xs tracking-widest">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewWfh;