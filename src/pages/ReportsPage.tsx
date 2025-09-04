import * as React from 'react';
import { AppBar, AppBarSection } from '@progress/kendo-react-layout';
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
  type GridRowClickEvent
} from '@progress/kendo-react-grid';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import {
  DropDownList,
  type DropDownListChangeEvent
} from '@progress/kendo-react-dropdowns';

type ReportRow = {
  id: number;
  reportName: string;
  createdOn: string;
  modifiedOn: string;
  modifiedBy: string;
  active: boolean;
  status?: string;
  companyId: number;
};

type HistoryRow = {
  id: number;
  version?: string;
  createdOn: string;
  modifiedOn: string;
  modifiedBy: string;
  status?: string;
  reportId: number;
};

type Company = { id: number; name: string };

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div style={{ border: '1px solid #e5e5e5', background: '#fff', padding: '8px 16px', minWidth: 110, textAlign: 'center' }}>
    <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    <div style={{ fontSize: 12 }}>{label}</div>
  </div>
);

export default function ReportsPage() {
  const [company, setCompany] = React.useState<number | null>(null);
  const [query, setQuery] = React.useState<string>('');
  const [selectedReportId, setSelectedReportId] = React.useState<number | null>(null);

  const companies: Company[] = React.useMemo(
    () => [
      { id: 1, name: 'Eurotacs' },
      { id: 2, name: 'Acme' }
    ],
    []
  );

  const reports: ReportRow[] = React.useMemo(
    () => [
      { id: 1, reportName: 'Loadlist', createdOn: '21/7/2024', modifiedOn: '25/7/2024', modifiedBy: 'Atif', active: true, companyId: 1 },
      { id: 2, reportName: 'Unloadlist', createdOn: '12/7/2024', modifiedOn: '23/7/2024', modifiedBy: 'Kas', active: true, companyId: 1 },
      { id: 3, reportName: 'Order label A6', createdOn: '30/6/2024', modifiedOn: '15/7/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
      { id: 4, reportName: 'Order label 110x50', createdOn: '30/7/2024', modifiedOn: '19/8/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 },
      { id: 5, reportName: 'Order label 70x37', createdOn: '30/8/2024', modifiedOn: '18/9/2024', modifiedBy: 'Abdul Kareem', active: false, companyId: 2 }
    ],
    []
  );

  const history: HistoryRow[] = [
    { id: 1, version: 'v1', createdOn: '17/7/2025', modifiedOn: '17/7/2025', modifiedBy: 'Atif',  status: 'Published',     reportId: 1 },
    { id: 1, version: 'v2', createdOn: '16/8/2025', modifiedOn: '17/8/2025', modifiedBy: 'Atif',  status: 'Published',     reportId: 1 },
    { id: 2, version: 'v1', createdOn: '18/7/2025', modifiedOn: '18/7/2025', modifiedBy: 'Kas',   status: 'Published',     reportId: 2 },
    { id: 3, version: 'v1', createdOn: '19/7/2025', modifiedOn: '19/7/2025', modifiedBy: 'Arooba',status: 'Not Published', reportId: 3 }
  ];

  // Visible reports: only after a company is chosen; search applies within that company
  const visibleReports = React.useMemo(() => {
    if (company == null) return [];
    const q = query.trim().toLowerCase();
    return reports
      .filter(r => r.companyId === company)
      .filter(r => (q ? r.reportName.toLowerCase().includes(q) : true));
  }, [reports, company, query]);

  // KPIs based on visible reports
  const totals = React.useMemo(() => {
    const total = visibleReports.length;
    const active = visibleReports.filter(r => r.active).length;
    return { total, active, inactive: total - active };
  }, [visibleReports]);

  const dataWithStatus = React.useMemo(
    () => visibleReports.map(r => ({ ...r, status: r.active ? 'Active' : 'In-Active' })),
    [visibleReports]
  );

  // Versions for selected report
  const visibleVersions = React.useMemo(
    () => (selectedReportId == null ? [] : history.filter(h => h.reportId === selectedReportId)),
    [history, selectedReportId]
  );

  // Handlers
  const onCompanyChange = (e: DropDownListChangeEvent) => {
    const value = e.value as Company | null;
    setCompany(value?.id ?? null);
    setSelectedReportId(null); // reset versions when company changes
  };

  const onRowClick = (e: GridRowClickEvent) => {
    const row = e.dataItem as ReportRow;
    setSelectedReportId(row.id);
  };

  const selectedCompanyObj = companies.find(c => c.id === company) ?? null;

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar>
        <AppBarSection>FleetGO</AppBarSection>
        <AppBarSection className="k-spacer" />
        <AppBarSection><Button fillMode="flat" icon="cog" /></AppBarSection>
        <AppBarSection><Button fillMode="flat" icon="user" /></AppBarSection>
      </AppBar>

      <div style={{ padding: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', padding: 16 }}>
          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <DropDownList
              data={companies}
              textField="name"
              dataItemKey="id"
              defaultItem={{ id: 0, name: 'Select Company' }}
              value={selectedCompanyObj}
              onChange={onCompanyChange}
              style={{ width: 260 }}
            />
            <Input
              placeholder="search 'report name'"
              value={query}
              onChange={(e) => setQuery(e.value)}
              disabled={company == null}
              style={{ width: 320 }}
            />
            {/* KPIs – only when a company is selected */}
            {company != null && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                <StatBox label="Total Reports" value={totals.total} />
                <StatBox label="Active" value={totals.active} />
                <StatBox label="In-Active" value={totals.inactive} />
              </div>
            )}
          </div>

          {/* Reports grid – only when a company is selected */}
          {company != null && (
            <Grid
              data={dataWithStatus}
              sortable
              autoProcessData
              onRowClick={onRowClick}
              style={{ marginBottom: 24 }}
            >
              <GridToolbar>
                <Button themeColor="error" icon="trash">Delete</Button>
                <Button icon="copy">Copy</Button>
              </GridToolbar>
              <Column field="reportName" title="Report Name" />
              <Column field="createdOn" title="Creation Date" />
              <Column field="modifiedOn" title="Modified On" />
              <Column field="modifiedBy" title="Modified By" />
              <Column field="status" title="Status" />
            </Grid>
          )}

          {/* Version History – only when a row has been clicked */}
          {selectedReportId != null && (
            <div>
              <h3 style={{ marginBottom: 8 }}>Version History</h3>
              <Grid data={visibleVersions}>
                <GridToolbar>
                  <Button themeColor="error" icon="trash">Delete</Button>
                </GridToolbar>
                <Column field="version" title="Version" />
                <Column field="createdOn" title="Creation Date" />
                <Column field="modifiedOn" title="Modified On" />
                <Column field="modifiedBy" title="Modified By" />
                <Column field="status" title="Status" />
              </Grid>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
