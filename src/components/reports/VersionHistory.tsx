// import React, { useState } from 'react';
// import { ReportVersion } from '../../types';

// interface VersionHistoryProps {
//   versions: ReportVersion[];
//   selectedVersions: string[];
//   onVersionSelect: (versionId: string) => void;
//   onSelectAll: () => void;
//   onDownloadVersion: (versionId: string) => void;
//   onPublishVersion: (versionId: string) => void;
//   onNewVersion: () => void;
//   onEditVersion: (versionId: string) => void;
//   onDeleteVersion: (versionId: string) => void;
//   loading?: boolean;
// }

// export const VersionHistory: React.FC<VersionHistoryProps> = ({
//   versions,
//   selectedVersions,
//   onVersionSelect,
//   onSelectAll,
//   onDownloadVersion,
//   onPublishVersion,
//   onNewVersion,
//   onEditVersion,
//   onDeleteVersion,
//   loading = false
// }) => {
//   const allSelected = versions.length > 0 && selectedVersions.length === versions.length;

//   return (
//     <div className="bg-white rounded-lg shadow">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-medium text-gray-900">Version History</h3>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={onNewVersion}
//               className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               New Version
//             </button>
//             <button
//               onClick={() => selectedVersions.forEach(id => onDeleteVersion(id))}
//               disabled={selectedVersions.length === 0}
//               className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               title="Delete Selected"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Information Box */}
//       <div className="p-4 bg-yellow-50 border-b border-yellow-200">
//         <p className="text-sm text-yellow-800">
//           Every report will have an initial version (v1) by default.
//         </p>
//       </div>

//       {/* Versions Table */}
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
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Version</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Creation Date</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Modified On</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Modified By</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Publish</th>
//               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
//                   Loading versions...
//                 </td>
//               </tr>
//             ) : versions.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
//                   No versions found
//                 </td>
//               </tr>
//             ) : (
//               versions.map((version) => (
//                 <tr
//                   key={version.id}
//                   className={`hover:bg-gray-50 ${
//                     selectedVersions.includes(version.id) ? 'bg-blue-50' : ''
//                   }`}
//                 >
//                   <td className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedVersions.includes(version.id)}
//                       onChange={() => onVersionSelect(version.id)}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                   </td>
//                   <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                     {version.version}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {new Date(version.creationDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {new Date(version.modifiedOn).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {version.modifiedBy}
//                   </td>
//                   <td className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={version.isPublished}
//                       readOnly
//                       className="rounded border-gray-300 text-green-600 focus:ring-green-500"
//                     />
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => onDownloadVersion(version.id)}
//                         className="p-1 text-blue-600 hover:bg-blue-100 rounded"
//                         title="Download"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => onPublishVersion(version.id)}
//                         className="p-1 text-green-600 hover:bg-green-100 rounded"
//                         title="Publish"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={onNewVersion}
//                         className="p-1 text-blue-600 hover:bg-blue-100 rounded"
//                         title="New Version"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => onEditVersion(version.id)}
//                         className="p-1 text-gray-600 hover:bg-gray-100 rounded"
//                         title="Edit"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => onDeleteVersion(version.id)}
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
