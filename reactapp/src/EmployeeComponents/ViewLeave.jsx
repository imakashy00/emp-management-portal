import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';

const ViewLeave = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null); // For Delete Confirmation Modal

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return navigate('/login');
      
      const response = await axios.get(`${API.GET_LEAVE_BY_USER}/${userId}`);
      setRequests(response.data);
    } catch (err) {
      console.error("Fetch error", err);
      toast.error("Failed to load leave history");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API.DELETE_LEAVE}/${deleteId}`);
      toast.success("Leave Request Deleted!");
      setDeleteId(null);
      fetchRequests(); // Refresh table
    } catch (err) {
      toast.error("Delete failed. Please try again.");
    }
  };

  // Filter logic based on Reason (Ref: Page 40)
  const filteredRequests = requests.filter(req => 
    req.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f4f7f6] min-h-screen font-['Segoe_UI',sans-serif]">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-xl font-bold text-[#1C4587] uppercase tracking-wider">My Leave History</h2>
          <button 
            onClick={() => navigate('/apply-leave')}
            className="bg-[#1C4587] text-white px-4 py-2 rounded font-bold text-xs hover:bg-[#3C78D8] transition-colors"
          >
            + APPLY NEW LEAVE
          </button>
        </div>

        {/* Search Bar (Ref: Page 40) */}
        <div className="mb-6 flex gap-4">
          <input 
            type="text" 
            placeholder="Search by Reason..." 
            className="p-2.5 border border-gray-200 rounded-lg w-full max-w-md outline-none focus:border-[#3C78D8] text-sm shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1C4587] text-white text-[11px] uppercase tracking-widest">
                <th className="p-4">S.No</th>
                <th className="p-4">Leave Type</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 italic bg-gray-50/30">
                    No leave records found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req, index) => (
                  <tr key={req._id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-400">{index + 1}</td>
                    <td className="p-4 font-semibold text-[#1C4587]">{req.leaveType}</td>
                    <td className="p-4 text-gray-600">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 truncate max-w-[180px]" title={req.reason}>{req.reason}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {/* Edit/Delete only visible for PENDING (Ref: Page 43) */}
                        {req.status === 'Pending' ? (
                          <>
                            <button 
                              onClick={() => navigate('/apply-leave', { state: { editData: req } })}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-bold transition-all shadow-sm"
                            >
                              EDIT
                            </button>
                            <button 
                              onClick={() => setDeleteId(req._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-[10px] font-bold transition-all shadow-sm"
                            >
                              DELETE
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-300 italic text-[11px] font-medium flex items-center gap-1">
                             🔒 Finalized
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL (Ref: Page 43) --- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-gray-800">Remove Request?</h3>
            <p className="text-sm text-gray-500 mt-2 mb-8">This action is permanent and cannot be undone.</p>
            <div className="flex gap-4">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLeave;