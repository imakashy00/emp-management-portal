import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Calendar, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import API from '../apiConfig'; 

const WfhRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWfhRequests();
  }, []);

  const fetchWfhRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // ENSURE THIS MATCHES YOUR LOGIN COMPONENT KEY
      
      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }

      // Hits: GET /api/wfhRequest
      const response = await axios.get(API.GET_ALL_WFH, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please sign out and sign in again.");
      } else {
        toast.error("Failed to load WFH requests");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      // Hits: PATCH /api/wfhRequest/:id/status
      // Body: { status: "Approved" } or { status: "Rejected" }
      const response = await axios.patch(`${API.UPDATE_WFH_STATUS}/${id}/status`, 
        { status: newStatus }, 
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          } 
        }
      );

      if (response.status === 200) {
        toast.success(`Request marked as ${newStatus}`);
        fetchWfhRequests(); // Reload list to show updated status
      }
    } catch (error) {
      console.error("Status update error:", error);
      const errorMsg = error.response?.data?.message || "Action failed";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
      <Toaster position="top-right" />

      {/* Header with Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1C4587]">WFH Approval Portal</h2>
          <p className="text-gray-500 text-sm font-medium">Review and respond to pending requests</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 font-bold text-xs">
            Pending: {requests.filter(r => r.status === 'Pending').length}
          </div>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 font-bold text-xs">
            Total: {requests.length}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8fafc] border-b border-gray-100">
              <tr className="text-[#1C4587] text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Employee</th>
                <th className="px-8 py-5">Request Duration</th>
                <th className="px-8 py-5">Reason</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3C78D8] mx-auto mb-2" />
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Processing...</span>
                  </td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1C4587] text-white flex items-center justify-center font-bold">
                          {req.employeeId?.userName?.charAt(0).toUpperCase() || 'E'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{req.employeeId?.userName || "User"}</div>
                          <div className="text-[10px] text-gray-400 font-medium italic">{req.employeeId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col text-sm text-gray-600 font-medium">
                          <span>{new Date(req.startDate).toLocaleDateString()}</span>
                          <span className="text-[10px] text-gray-300">to</span>
                          <span>{new Date(req.endDate).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm text-gray-600 max-w-xs truncate" title={req.reason}>
                        <MessageSquare className="w-4 h-4 inline mr-2 text-gray-300" />
                        {req.reason}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(req._id, 'Approved')}
                            className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(req._id, 'Rejected')}
                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-24 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">No WFH requests to display</p>
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

export default WfhRequest;