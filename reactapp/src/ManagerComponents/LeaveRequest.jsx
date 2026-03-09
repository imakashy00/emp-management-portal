
import React, { useState } from 'react';
import { Info, Check, X, Loader2, Inbox, FileText } from 'lucide-react';
import { useTableData } from '../hooks/useTableData';
import FilterBar from '../Components/FilterBar';
import Pagination from '../Components/Pagination'; // 1. Import the Pagination component
import API from '../apiConfig';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const LeaveRequest = () => {
  const { data: requests, loading, filters, totalPages, updateFilter, refresh } =
    useTableData(API.GET_ALL_LEAVES);
  const [selectedReq, setSelectedReq] = useState(null);

  const renderFilePreview = (fileName) => {
    if (!fileName) return null;

    const fileUrl = `${API.UPLOADS}/${fileName}`;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    // 1. If it's an Image
    if (['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension)) {
      return (
        <div className="mt-4 border rounded-lg overflow-hidden bg-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase p-2 border-b bg-white">Image Preview</p>
          <img
            src={fileUrl}
            alt="Attachment"
            className="w-full h-auto max-h-[300px] object-contain mx-auto"
          />
        </div>
      );
    }
    // 2. If it's a PDF
    if (fileExtension === 'pdf') {
      return (
        <div className="mt-4 border rounded-lg overflow-hidden bg-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase p-2 border-b bg-white">PDF Preview</p>
          <iframe
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-[400px]"
            title="PDF Document"
          ></iframe>
        </div>
      );
    }

    // 3. Fallback for other files
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-xs text-blue-500 font-medium pt-2 hover:underline mt-4"
      >
        <FileText size={14} /> Download Document ({fileExtension.toUpperCase()})
      </a>
    );
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API.UPDATE_LEAVE_STATUS}/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Request ${status}`);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans antialiased text-gray-900">
      <Toaster position="top-center" />

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Leave Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage employee absence requests</p>
      </div>

      <FilterBar filters={filters} onFilterChange={updateFilter} />

      <div className="min-h-[400px] my-3">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-100 text-gray-400 text-[11px] font-semibold uppercase tracking-widest">
              <th className="pb-4">Employee</th>
              <th className="pb-4">Type & Duration</th>
              <th className="pb-4">Reason</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="5" className="py-24 text-center"><Loader2 className="animate-spin inline-block text-gray-300" size={24} /></td></tr>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5">
                    <div className="text-sm font-medium text-gray-700">{req.employeeId?.userName}</div>
                    <div className="text-[11px] text-gray-400">{req.employeeId?.email}</div>
                  </td>
                  <td className="py-5">
                    <div className="text-xs text-gray-700 font-medium">{req.leaveType}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(req.startDate).toLocaleDateString('en-GB')} - {new Date(req.endDate).toLocaleDateString('en-GB')}
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-sm text-gray-500 truncate max-w-[180px]" title={req.reason}>{req.reason}</p>
                  </td>
                  <td className="py-5">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase ${req.status === 'Approved' ? 'text-green-600 bg-green-50' :
                      req.status === 'Rejected' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'
                      }`}>{req.status}</span>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex justify-end gap-4">
                      <button onClick={() => setSelectedReq(req)} className="text-blue-500 hover:text-blue-700" title="View Details">
                        <Info size={18} />
                      </button>
                      {req.status === 'Pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="text-green-600 hover:text-green-800" title="Approve">
                            <Check size={18} />
                          </button>
                          <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="text-red-600 hover:text-red-800" title="Reject">
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-24 text-center text-gray-400 text-sm"><Inbox className="w-10 h-10 mx-auto mb-3 opacity-20" /> No requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 2. Replace manual buttons with the Pagination component */}
      <Pagination
        filters={filters}
        totalPages={totalPages}
        onPageChange={(page) => updateFilter('page', page)}
      />

      {/* Detail Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Increased max-width to max-w-2xl to fit the document preview nicely */}
          <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedReq.employeeId?.userName}</h3>
                  <p className="text-xs text-gray-400">{selectedReq.employeeId?.email}</p>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Leave Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-50">
                <div className="md:col-span-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</p>
                      <p className="text-sm font-medium text-gray-700">{selectedReq.leaveType}</p>
                    </div>
                  </div>
                  <div className='spacey-y-1'>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${selectedReq.status === 'Approved' ? 'text-green-600 bg-green-50' :
                      selectedReq.status === 'Rejected' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'
                      }`}>{selectedReq.status}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
                    <p className="text-sm text-gray-700">
                      {new Date(selectedReq.startDate).toLocaleDateString('en-GB')} — {new Date(selectedReq.endDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason</p>
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedReq.reason}"</p>
                  </div>
                </div>

                {/* Document Preview Section */}
                <div className="md:col-span-2 bg-gray-50/50 rounded-md">
                  {selectedReq.file ? (
                    renderFilePreview(selectedReq.file)
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-10 text-gray-300">
                      <FileText size={40} className="opacity-20 mb-2" />
                      <p className="text-xs font-medium">No document attached</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;




















// import React, { useState } from 'react';
// // ... other imports

// const LeaveRequest = () => {
//   // ... existing logic (useTableData, handleStatusUpdate)

//   // Helper to determine how to render the file
//   const renderFilePreview = (fileName) => {
//     if (!fileName) return null;

//     const fileUrl = `${API.BASE_URL}/uploads/${fileName}`;
//     const fileExtension = fileName.split('.').pop().toLowerCase();

//     // 1. If it's an Image
//     if (['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension)) {
//       return (
//         <div className="mt-4 border rounded-lg overflow-hidden bg-gray-50">
//           <p className="text-[10px] font-bold text-gray-400 uppercase p-2 border-b bg-white">Image Preview</p>
//           <img
//             src={fileUrl}
//             alt="Attachment"
//             className="w-full h-auto max-h-[300px] object-contain mx-auto"
//           />
//         </div>
//       );
//     }

//     // 2. If it's a PDF
//     if (fileExtension === 'pdf') {
//       return (
//         <div className="mt-4 border rounded-lg overflow-hidden bg-gray-50">
//           <p className="text-[10px] font-bold text-gray-400 uppercase p-2 border-b bg-white">PDF Preview</p>
//           <iframe
//             src={`${fileUrl}#toolbar=0`}
//             className="w-full h-[400px]"
//             title="PDF Document"
//           ></iframe>
//         </div>
//       );
//     }

//     // 3. Fallback for other files
//     return (
//       <a
//         href={fileUrl}
//         target="_blank"
//         rel="noreferrer"
//         className="flex items-center gap-2 text-xs text-blue-500 font-medium pt-2 hover:underline mt-4"
//       >
//         <FileText size={14} /> Download Document ({fileExtension.toUpperCase()})
//       </a>
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto font-sans antialiased text-gray-900">
//       {/* ... Table and Pagination code ... */}

//       {/* Updated Detail Modal */}
//       {selectedReq && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           {/* Increased max-width to max-w-2xl to fit the document preview nicely */}
//           <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">

//               {/* Header */}
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">{selectedReq.employeeId?.userName}</h3>
//                   <p className="text-xs text-gray-400">{selectedReq.employeeId?.email}</p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedReq(null)}
//                   className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               {/* Leave Details Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-50">
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</p>
//                       <p className="text-sm font-medium text-gray-700">{selectedReq.leaveType}</p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
//                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${selectedReq.status === 'Approved' ? 'text-green-600 bg-green-50' :
//                           selectedReq.status === 'Rejected' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'
//                         }`}>{selectedReq.status}</span>
//                     </div>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
//                     <p className="text-sm text-gray-700">
//                       {new Date(selectedReq.startDate).toLocaleDateString('en-GB')} — {new Date(selectedReq.endDate).toLocaleDateString('en-GB')}
//                     </p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason</p>
//                     <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedReq.reason}"</p>
//                   </div>
//                 </div>

//                 {/* Document Preview Section */}
//                 <div className="bg-gray-50/50 p-2 rounded-xl">
//                   {selectedReq.file ? (
//                     renderFilePreview(selectedReq.file)
//                   ) : (
//                     <div className="h-full flex flex-col items-center justify-center py-10 text-gray-300">
//                       <FileText size={40} className="opacity-20 mb-2" />
//                       <p className="text-xs font-medium">No document attached</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Footer Button */}
//               <button
//                 onClick={() => setSelectedReq(null)}
//                 className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors"
//               >
//                 Close Details
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeaveRequest;