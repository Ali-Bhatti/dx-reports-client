import type { ReportStatistics } from '../types';

export type ReportListItem = {
  id: number;
  reportName: string;
  createdOn: string;
  modifiedOn: string;
  modifiedBy: string;
  active: boolean;
  companyId: number;
};

export type ReportVersionItem = {
  id: number;
  version: string;
  createdOn: string;
  modifiedOn: string;
  modifiedBy: string;
  published: boolean;
  reportId: number;
};

const reports: ReportListItem[] = [
  { id: 1, reportName: 'Loadlist', createdOn: '21/7/2024', modifiedOn: '25/7/2024', modifiedBy: 'Atif', active: true, companyId: 1 },
  { id: 2, reportName: 'Unloadlist', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 3, reportName: 'Unloadlist1', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 4, reportName: 'Unloadlist2', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: false, companyId: 1 },
  { id: 5, reportName: 'Unloadlist3', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 6, reportName: 'Unloadlist4', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 7, reportName: 'Unloadlist5', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: false, companyId: 1 },
  { id: 8, reportName: 'Unloadlist6', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 9, reportName: 'Unloadlist7', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 10, reportName: 'Unloadlist8', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 11, reportName: 'Unloadlist9', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 12, reportName: 'Unloadlist00', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: false, companyId: 1 },
  { id: 13, reportName: 'Unloadlist11', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 14, reportName: 'Unloadlist12', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 15, reportName: 'Unloadlist13', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 16, reportName: 'Unloadlist14', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 17, reportName: 'Unloadlist', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
  { id: 18, reportName: 'Order label A6', createdOn: '30/6/2024', modifiedOn: '15/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 19, reportName: 'Order label 110x50', createdOn: '30/7/2024', modifiedOn: '19/8/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 20, reportName: 'Order label1 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 21, reportName: 'Order label2 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 22, reportName: 'Order label3 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 23, reportName: 'Order label4 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 24, reportName: 'Order label5 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 25, reportName: 'Order label6 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 26, reportName: 'Order label7 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 27, reportName: 'Order label8 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 28, reportName: 'Order label9 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 29, reportName: 'Order label00 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 30, reportName: 'Order label11 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 31, reportName: 'Order label12 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 32, reportName: 'Order label13 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 33, reportName: 'Order label14 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 34, reportName: 'Order label15 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 35, reportName: 'Order label16 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 36, reportName: 'Order label17 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 37, reportName: 'Order label18 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 38, reportName: 'Order label19 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
  { id: 39, reportName: 'Order label20 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
];

const reportVersions: ReportVersionItem[] = [
  { id: 1, version: 'v1', createdOn: '17/7/2025', modifiedOn: '17/7/2025', modifiedBy: 'Atif', published: true, reportId: 1 },
  { id: 2, version: 'v2', createdOn: '16/8/2025', modifiedOn: '17/8/2025', modifiedBy: 'Atif', published: false, reportId: 1 },
  { id: 3, version: 'v1', createdOn: '18/7/2025', modifiedOn: '18/7/2025', modifiedBy: 'Kas', published: true, reportId: 2 },
  { id: 4, version: 'v1', createdOn: '19/7/2025', modifiedOn: '19/7/2025', modifiedBy: 'Arooba', published: false, reportId: 3 },
];

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchReportsByCompany(companyId: number): Promise<ReportListItem[]> {
  await delay();
  return reports.filter(report => report.companyId === companyId);
}

export async function fetchCompanyKpis(companyId: number): Promise<ReportStatistics[]> {
  await delay();
  const companyReports = reports.filter(report => report.companyId === companyId);
  const totalReports = companyReports.length;
  const activeReports = companyReports.filter(report => report.active).length;
  const inactiveReports = totalReports - activeReports;

  return [
    { label: 'Total Reports', total: totalReports },
    { label: 'Active Reports', total: activeReports },
    { label: 'In-Active Reports', total: inactiveReports },
  ];
}

export async function fetchReportVersions(reportId: number): Promise<ReportVersionItem[]> {
  await delay();
  return reportVersions.filter(version => version.reportId === reportId);
}

export { reports as reportListMock, reportVersions as reportVersionMock };
