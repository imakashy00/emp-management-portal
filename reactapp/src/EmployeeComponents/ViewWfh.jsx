import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';

const ViewWfh = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null); // Triggers Modal

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${API.GET_WFH_BY_USER}/${userId}`);
      setRequests(response.data);
    } catch (err) { console.error("Fetch error", err); }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API.DELETE_WFH}/${deleteId}`);
      toast.success("Request Deleted!");
      setDeleteId(null);
      fetchRequests();
    } catch (err) { toast.error("Delete failed"); }
  };

  const filteredRequests = requests.filter(req => 
    req.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f4f7f6] min-h-screen w-full">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-[#1C4587] mb-6 border-b pb-4 uppercase">My WFH History</h2>
        
        <input 
          type="text" 
          placeholder="Search by Reason..." 
          className="mb-6 p-2 border rounded-lg w-full max-w-md outline-none focus:border-[#3C78D8] text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1C4587] text-white text-xs uppercase">
              <th className="p-4">S.No</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req, index) => (
              <tr key={req._id} className="border-b text-sm hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-400">{index + 1}</td>
                <td className="p-4">
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                </td>
                <td className="p-4 truncate max-w-[200px]">{req.reason}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>{req.status}</span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  {req.status === 'Pending' ? (
                    <>
                      <button 
                        onClick={() => navigate('/apply-wfh', { state: { editData: req } })} 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                      >Edit</button>
                      <button 
                        onClick={() => setDeleteId(req._id)} 
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                      >Delete</button>
                    </>
                  ) : <span className="text-gray-300 italic text-xs">Locked</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CONFIRMATION MODAL (Ref: Page 36) --- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mt-2 mb-8">Are you sure you want to delete this request? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold transition-colors">Yes, Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-bold transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewWfh;