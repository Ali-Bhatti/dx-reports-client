// import React, { useState, useEffect } from 'react';
// import { Header } from '../components/layout/Header';
// import { CompanySelector } from '../components/common/CompanySelector';
// import { StatisticsCards } from '../components/dashboard/StatisticsCards';
// import { ReportList } from '../components/reports/ReportList';
// import { VersionHistory } from '../components/reports/VersionHistory';
// import { InfoBox } from '../components/common/InfoBox';
// import { useReports } from '../hooks/useReports';
// import { Report, ReportVersion, User } from '../types';

// export const Dashboard: React.FC = () => {
//   const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
//   const [selectedReportId, setSelectedReportId] = useState<string>('');
//   const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
//   const [user, setUser] = useState<User | null>(null);

//   const {
//     reports,
//     loading: reportsLoading,
//     error: reportsError,
//     statistics,
//     selectedReports,
//     fetchReports,
//     createReport,
//     updateReport,
//     deleteReport,
//     copyReport,
//     toggleReportSelection,
//     selectAllReports,
//     clearSelection,
//   } = useReports(selectedCompanyId);

//   const [versions, setVersions] = useState<ReportVersion[]>([]);
//   const [versionsLoading, setVersionsLoading] = useState(false);

//   // Mock data for demonstration
//   useEffect(() => {
//     // Simulate user data
//     setUser({
//       id: '1',
//       name: 'Atif',
//       email: 'atif@fleetgo.com',
//       role: 'Admin'
//     });

//     // Mock versions data
//     setVersions([
//       {
//         id: 'v1',
//         reportId: '1',
//         version: 'v1',
//         creationDate: '2025-07-01',
//         modifiedOn: '2025-07-25',
//         modifiedBy: 'Atif',
//         isPublished: false
//       },
//       {
//         id: 'v2',
//         reportId: '1',
//         version: 'v2',
//         creationDate: '2025-08-01',
//         modifiedOn: '2025-08-25',
//         modifiedBy: 'Atif',
//         isPublished: false
//       },
//       {
//         id: 'v3',
//         reportId: '1',
//         version: 'v3',
//         creationDate: '2025-09-01',
//         modifiedOn: '2025-09-25',
//         modifiedBy: 'Atif',
//         isPublished: true
//       }
//     ]);
//   }, []);

//   const handleCompanyChange = (companyId: string) => {
//     setSelectedCompanyId(companyId);
//     clearSelection();
//     setSelectedReportId('');
//     setSelectedVersions([]);
//   };

//   const handleReportSelect = (reportId: string) => {
//     setSelectedReportId(reportId);
//     toggleReportSelection(reportId);
//   };

//   const handleVersionSelect = (versionId: string) => {
//     setSelectedVersions(prev => 
//       prev.includes(versionId) 
//         ? prev.filter(id => id !== versionId)
//         : [...prev, versionId]
//     );
//   };

//   const handleSelectAllVersions = () => {
//     setSelectedVersions(versions.map(v => v.id));
//   };

//   const handleCopyReport = async (reportId: string) => {
//     try {
//       await copyReport(reportId);
//     } catch (error) {
//       console.error('Failed to copy report:', error);
//     }
//   };

//   const handleDeleteReport = async (reportId: string) => {
//     try {
//       await deleteReport(reportId);
//       if (selectedReportId === reportId) {
//         setSelectedReportId('');
//       }
//     } catch (error) {
//       console.error('Failed to delete report:', error);
//     }
//   };

//   const handleLinkToWeb = (reportId: string) => {
//     // Implement web link functionality
//     console.log('Link to web for report:', reportId);
//   };

//   const handleEditReport = (reportId: string) => {
//     // Navigate to report editor
//     console.log('Edit report:', reportId);
//   };

//   const handleDownloadVersion = (versionId: string) => {
//     // Implement download functionality
//     console.log('Download version:', versionId);
//   };

//   const handlePublishVersion = (versionId: string) => {
//     // Implement publish functionality
//     console.log('Publish version:', versionId);
//   };

//   const handleNewVersion = () => {
//     // Implement new version creation
//     console.log('Create new version');
//   };

//   const handleEditVersion = (versionId: string) => {
//     // Navigate to version editor
//     console.log('Edit version:', versionId);
//   };

//   const handleDeleteVersion = (versionId: string) => {
//     // Implement version deletion
//     console.log('Delete version:', versionId);
//   };

//   const handleSettingsClick = () => {
//     console.log('Settings clicked');
//   };

//   const handleUserClick = () => {
//     console.log('User clicked');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header 
//         user={user || undefined}
//         onSettingsClick={handleSettingsClick}
//         onUserClick={handleUserClick}
//       />
      
//       <main className="p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Company Selector and Statistics Row */}
//           <div className="grid grid-cols-4 gap-6 mb-6">
//             <div className="col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Company
//               </label>
//               <CompanySelector
//                 selectedCompanyId={selectedCompanyId}
//                 onCompanyChange={handleCompanyChange}
//               />
//             </div>
            
//             <div className="col-span-3">
//               <StatisticsCards 
//                 statistics={statistics}
//                 loading={reportsLoading}
//               />
//             </div>
//           </div>

//           {/* Information Box */}
//           <div className="mb-6">
//             <InfoBox
//               message="Other Company related information can be displayed e.g. company status, license related info."
//               type="warning"
//             />
//           </div>

//           {/* Reports List */}
//           <div className="mb-8">
//             <ReportList
//               reports={reports}
//               selectedReports={selectedReports}
//               onReportSelect={handleReportSelect}
//               onSelectAll={selectAllReports}
//               onCopyReport={handleCopyReport}
//               onDeleteReport={handleDeleteReport}
//               onLinkToWeb={handleLinkToWeb}
//               onEditReport={handleEditReport}
//               loading={reportsLoading}
//             />
//           </div>

//           {/* Version History */}
//           {selectedReportId && (
//             <div className="mb-8">
//               <VersionHistory
//                 versions={versions}
//                 selectedVersions={selectedVersions}
//                 onVersionSelect={handleVersionSelect}
//                 onSelectAll={handleSelectAllVersions}
//                 onDownloadVersion={handleDownloadVersion}
//                 onPublishVersion={handlePublishVersion}
//                 onNewVersion={handleNewVersion}
//                 onEditVersion={handleEditVersion}
//                 onDeleteVersion={handleDeleteVersion}
//                 loading={versionsLoading}
//               />
//             </div>
//           )}

//           {/* Error Display */}
//           {reportsError && (
//             <div className="mb-6">
//               <InfoBox
//                 message={reportsError}
//                 type="error"
//               />
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };
