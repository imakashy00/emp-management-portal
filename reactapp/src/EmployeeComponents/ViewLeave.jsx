// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import API from '../apiConfig';
// import { toast } from 'react-toastify';
// import { ChevronLeft, ChevronRight, Search, PlusCircle, Lock } from 'lucide-react';

// const ViewLeave = () => {
//   const navigate = useNavigate();
//   const [requests, setRequests] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const limit = 5;
//   const [deleteId, setDeleteId] = useState(null);

//   useEffect(() => { fetchRequests(); }, [currentPage, searchTerm]);

//   const fetchRequests = async () => {
//     try {
//       const employeeId = localStorage.getItem('userId');
//       const token = localStorage.getItem('token');
//       const url = `${API.GET_LEAVE_BY_USER}/${employeeId}?page=${currentPage}&limit=${limit}&search=${searchTerm}`;
//       const response = await axios.get(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (response.data && response.data.data) {
//         setRequests(response.data.data);
//         setTotalPages(response.data.pages || 1);
//         setTotalRecords(response.data.total || 0);
//       }
//     } catch (err) { toast.error("Failed to load history"); }
//   };

//   const confirmDelete = async () => {
//     try {
//       await axios.delete(`${API.DELETE_LEAVE}/${deleteId}`);
//       toast.success("Leave Request Deleted!");
//       setDeleteId(null);
//       fetchRequests();
//     } catch (err) { toast.error("Delete failed"); }
//   };

//   return (
//     <div className="p-8 bg-[#f4f7f6] min-h-screen font-['Segoe_UI',sans-serif]">
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">

//         <div className="flex justify-between items-center mb-8 border-b pb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-[#1C4587] uppercase tracking-tight">My Leave History</h2>
//             <p className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-widest">Found {totalRecords} Records</p>
//           </div>
//           <button onClick={() => navigate('/apply-leave')} className="bg-[#1C4587] text-white px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-md">
//             <PlusCircle size={14} /> APPLY NEW LEAVE
//           </button>
//         </div>

//         <div className="mb-6 relative max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//           <input type="text" placeholder="Search by Reason..." className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full text-sm outline-none focus:border-[#3C78D8] transition-all" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
//         </div>

//         <div className="overflow-x-auto rounded-xl border border-gray-100">
//           <table className="w-full text-left border-collapse table-fixed">
//             <thead>
//               <tr className="bg-[#1C4587] text-white text-[10px] font-black uppercase tracking-widest">
//                 <th className="p-4 w-16 text-center">S.No</th>
//                 <th className="p-4 w-28">Type</th>
//                 <th className="p-4 w-48">Duration</th>
//                 <th className="p-4">Reason</th>
//                 <th className="p-4 w-28 text-center">Status</th>
//                 <th className="p-4 w-32 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50 bg-white">
//               {requests.length === 0 ? (
//                 <tr><td colSpan={6} className="p-20 text-center text-gray-400 italic">No records available</td></tr>
//               ) : (
//                 requests.map((req, index) => (
//                   <tr key={req._id} className="text-sm hover:bg-gray-50 transition-colors">
//                     <td className="p-4 text-center font-bold text-gray-400">{(currentPage - 1) * limit + (index + 1)}</td>
//                     <td className="p-4 font-bold text-[#1C4587] uppercase text-[11px]">{req.leaveType}</td>
//                     <td className="p-4 text-gray-600 whitespace-nowrap">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</td>
//                     <td className="p-4 truncate text-gray-500" title={req.reason}>{req.reason}</td>
//                     <td className="p-4 text-center">
//                       <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{req.status}</span>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex justify-center gap-4">
//                         {req.status === 'Pending' ? (
//                           <>
//                             <button onClick={() => navigate('/apply-leave', { state: { editData: req } })} className="text-blue-500 font-bold text-[10px] uppercase hover:underline">Edit</button>
//                             <button onClick={() => setDeleteId(req._id)} className="text-red-500 font-bold text-[10px] uppercase hover:underline">Delete</button>
//                           </>
//                         ) : <Lock size={12} className="text-gray-300" />}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-8 flex items-center justify-between border-t pt-6">
//           <p className="text-[11px] text-gray-400 font-bold uppercase italic">Page {currentPage} of {totalPages}</p>
//           <div className="flex items-center gap-2">
//             <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-20"><ChevronLeft size={18} /></button>
//             <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-20"><ChevronRight size={18} /></button>
//           </div>
//         </div>
//       </div>

//       {deleteId && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
//             <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tighter">Are you sure?</h3>
//             <p className="text-sm text-gray-500 mt-2 mb-8 italic leading-relaxed">This action will delete your request permanently from the system.</p>
//             <div className="flex gap-4">
//               <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-lg text-xs uppercase transition-all">Yes, Delete</button>
//               <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-2.5 rounded-lg text-xs uppercase transition-all">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// //bas push
// export default ViewLeave;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast, Toaster } from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Search, Plus, Lock, Trash2, Edit3, Loader2 } from 'lucide-react';

const ViewLeave = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const limit = 6;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRequests();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const employeeId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const url = `${API.GET_LEAVE_BY_USER}/${employeeId}?page=${currentPage}&limit=${limit}&search=${searchTerm}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

      setRequests(response.data.data || []);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      toast.error("Failed to sync history");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API.DELETE_LEAVE}/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Request removed");
      setDeleteId(null);
      fetchRequests();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans antialiased text-slate-900 pt-2">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Leave History</h1>
          <p className="text-sm text-slate-500 mt-1">Review your official absence applications</p>
        </div>
        <button
          onClick={() => navigate('/apply-leave')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          <span>Apply New Leave</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-slate-100 pb-6 my-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by reason..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-blue-100 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="min-h-[400px] my-3">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-slate-400 text-[11px] font-semibold uppercase tracking-widest border-b border-slate-50">
              <th className="pb-4 font-semibold">Category</th>
              <th className="pb-4 font-semibold">Duration</th>
              <th className="pb-4 font-semibold">Reason</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="py-24 text-center"><Loader2 className="animate-spin inline-block text-blue-200" size={24} /></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5">
                    <div className="text-sm font-medium text-slate-700">{req.leaveType}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Official Leave</div>
                  </td>
                  <td className="py-5 text-xs text-slate-500 font-mono">
                    {new Date(req.startDate).toLocaleDateString('en-GB')} — {new Date(req.endDate).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-5">
                    <p className="text-sm text-slate-600 truncate max-w-[180px]" title={req.reason}>{req.reason}</p>
                  </td>
                  <td className="py-5">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase ${req.status === 'Approved' ? 'text-emerald-600 bg-emerald-50' :
                        req.status === 'Rejected' ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'
                      }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-5 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => navigate('/apply-leave', { state: { editData: req } })}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(req._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end text-slate-200" title="Locked">
                        <Lock size={16} />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-24 text-center text-slate-300 text-sm">
                  No records found in your leave history
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-8">
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="text-slate-300 hover:text-blue-600 disabled:opacity-10 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="text-slate-300 hover:text-blue-600 disabled:opacity-10 transition-all"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-2xl max-w-xs w-full text-center space-y-6 animate-in zoom-in duration-200">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Remove Request?</h3>
              <p className="text-xs text-slate-500 mt-2">This will permanently delete your leave application.</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={confirmDelete} className="w-full py-2.5 bg-red-600 text-white font-medium rounded-xl text-sm hover:bg-red-700 transition-all">Confirm Delete</button>
              <button onClick={() => setDeleteId(null)} className="w-full py-2.5 bg-slate-50 text-slate-600 font-medium rounded-xl text-sm hover:bg-slate-100 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLeave;