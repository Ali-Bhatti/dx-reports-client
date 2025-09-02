// import React, { useState } from 'react';
// import { Report } from '../../types';

// interface ReportListProps {
//   reports: Report[];
//   selectedReports: string[];
//   onReportSelect: (reportId: string) => void;
//   onSelectAll: () => void;
//   onCopyReport: (reportId: string) => void;
//   onDeleteReport: (reportId: string) => void;
//   onLinkToWeb: (reportId: string) => void;
//   onEditReport: (reportId: string) => void;
//   loading?: boolean;
// }

// export const ReportList: React.FC<ReportListProps> = ({
//   reports,
//   selectedReports,
//   onReportSelect,
//   onSelectAll,
//   onCopyReport,
//   onDeleteReport,
//   onLinkToWeb,
//   onEditReport,
//   loading = false
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredReports = reports.filter(report =>
//     report.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const allSelected = reports.length > 0 && selectedReports.length === reports.length;

//   return (
//     <div className="bg-white rounded-lg shadow">
//       {/* Search and Actions Header */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <div className="flex-1 max-w-md">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Q search 'report name'"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <svg
//                 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => selectedReports.forEach(id => onDeleteReport(id))}
//               disabled={selectedReports.length === 0}
//               className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               title="Delete Selected"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>
//             </button>
//             <button
//               onClick={() => selectedReports.forEach(id => onCopyReport(id))}
//               disabled={selectedReports.length === 0}
//               className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               title="Copy Selected"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Reports Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3 text-left">
//                 <input
//                   type="checkbox"
//                   checked={allSelected}
//                   onChange={onSelectAll}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Report Name</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Creation Date</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Modified On</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Modified By</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
//                   Loading reports...
//                 </td>
//               </tr>
//             ) : filteredReports.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
//                   No reports found
//                 </td>
//               </tr>
//             ) : (
//               filteredReports.map((report) => (
//                 <tr
//                   key={report.id}
//                   className={`hover:bg-gray-50 ${
//                     selectedReports.includes(report.id) ? 'bg-blue-50' : ''
//                   }`}
//                 >
//                   <td className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedReports.includes(report.id)}
//                       onChange={() => onReportSelect(report.id)}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                     {report.name}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {new Date(report.creationDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {new Date(report.modifiedOn).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {report.modifiedBy}
//                   </td>
//                   <td className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={report.status}
//                       readOnly
//                       className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//                     />
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => onLinkToWeb(report.id)}
//                         className="p-1 text-blue-600 hover:bg-blue-100 rounded"
//                         title="Link to Web Page"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => onCopyReport(report.id)}
//                         className="p-1 text-blue-600 hover:bg-blue-100 rounded"
//                         title="Copy"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => onEditReport(report.id)}
//                         className="p-1 text-gray-600 hover:bg-gray-100 rounded"
//                         title="Edit"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => onDeleteReport(report.id)}
//                         className="p-1 text-red-600 hover:bg-red-100 rounded"
//                         title="Delete"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
