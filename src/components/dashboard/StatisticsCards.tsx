// import React from 'react';
// import type { ReportStatistics } from '../../types';

// interface StatisticsCardsProps {
//   statistics: ReportStatistics | null;
//   loading?: boolean;
// }

// export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
//   statistics,
//   loading = false
// }) => {
//   if (loading) {
//     return (
//       <div className="grid grid-cols-3 gap-6 mb-6">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
//             <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (!statistics) {
//     return null;
//   }

//   return (
//     <div className="grid grid-cols-3 gap-6 mb-6">
//       {/* Total Reports */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center">
//           <div className="flex-shrink-0">
//             <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//           </div>
//           <div className="ml-4">
//             <p className="text-sm font-medium text-gray-600">Total Reports</p>
//             <p className="text-2xl font-bold text-gray-900">{statistics.totalReports}</p>
//           </div>
//         </div>
//       </div>

//       {/* Active Reports */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center">
//           <div className="flex-shrink-0">
//             <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <div className="ml-4">
//             <p className="text-sm font-medium text-gray-600">Active</p>
//             <p className="text-2xl font-bold text-gray-900">{statistics.activeReports}</p>
//           </div>
//         </div>
//       </div>

//       {/* Inactive Reports */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex items-center">
//           <div className="flex-shrink-0">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <div className="ml-4">
//             <p className="text-sm font-medium text-gray-600">In-Active</p>
//             <p className="text-2xl font-bold text-gray-900">{statistics.inactiveReports}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
