import * as React from 'react';
import { AppBar, AppBarSection } from '@progress/kendo-react-layout';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
// no type-only imports needed currently
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';

  type ReportRow = {
    id: number;
    reportName: string;
    createdOn: string;
    modifiedOn: string;
    modifiedBy: string;
    active: boolean;
    status?: string;
  };

type HistoryRow = {
  id: number;
  createdOn: string;
  modifiedOn: string;
  modifiedBy: string;
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div
    style={{
      border: '1px solid #d9d9d9',
      borderRadius: 4,
      padding: '8px 16px',
      minWidth: 120,
      textAlign: 'center'
    }}
 >
    <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    <div style={{ fontSize: 14 }}>{label}</div>
  </div>
);

export default function ReportsPage() {
  const [company, setCompany] = React.useState<string>('Eurotacs');
  const [query, setQuery] = React.useState<string>('');
  // data for the grids

  const reports = React.useMemo<ReportRow[]>(
    () => [
      {
        id: 1,
        reportName: 'Loadlist',
        createdOn: '21.7.2024',
        modifiedOn: '25.7.2024',
        modifiedBy: 'Atif',
        active: true
      },
      {
        id: 2,
        reportName: 'Unloadlist',
        createdOn: '12.7.2024',
        modifiedOn: '23.7.2024',
        modifiedBy: 'Kas',
        active: true
      },
      {
        id: 3,
        reportName: 'Order label A6',
        createdOn: '30.6.2024',
        modifiedOn: '15.7.2024',
        modifiedBy: 'Abdul Kareem',
        active: false
      }
    ],
    []
  );

  const history: HistoryRow[] = [
    { id: 1, createdOn: '17.7.2025', modifiedOn: '17.7.2025', modifiedBy: 'Atif' },
    { id: 2, createdOn: '18.7.2025', modifiedOn: '18.7.2025', modifiedBy: 'Kas' },
    { id: 3, createdOn: '19.7.2025', modifiedOn: '19.7.2025', modifiedBy: 'Arrooba' }
  ];

  const totals = React.useMemo(
    () => ({
      total: reports.length,
      active: reports.filter((r) => r.active).length,
      inactive: reports.filter((r) => !r.active).length
    }),
    [reports]
  );

  const filteredReports = React.useMemo(
    () =>
      query
        ? reports.filter((row) =>
            row.reportName.toLowerCase().includes(query.toLowerCase())
          )
        : reports,
    [reports, query]
  );

  const dataWithSelection = filteredReports.map((row) => ({
    ...row,
    status: row.active ? 'Active' : 'In-Active'
  }));

  // selection handling can be added here when needed

  // placeholders for potential custom cell renderers

  return (
    <div>
      <AppBar>
        <AppBarSection>FleetGO</AppBarSection>
        <AppBarSection className="k-spacer" />
        <AppBarSection>
          <Button fillMode="flat" icon="cog" />
        </AppBarSection>
        <AppBarSection>
          <Button fillMode="flat" icon="user" />
        </AppBarSection>
      </AppBar>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <DropDownList
            data={['Eurotacs', 'Acme']}
            value={company}
            onChange={(e) => setCompany(e.value as string)}
            style={{ width: 260 }}
          />
          <Input
            placeholder="search 'report name'"
            value={query}
            onChange={(e) => setQuery(e.value)}
            style={{ width: 320 }}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            <StatBox label="Total Reports" value={totals.total} />
            <StatBox label="Active Reports" value={totals.active} />
            <StatBox label="In-Active" value={totals.inactive} />
          </div>
        </div>

        <Grid data={dataWithSelection} style={{ maxHeight: 360 }}>
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

        <div style={{ marginTop: 32 }}>
          <h3 style={{ marginBottom: 8 }}>Version History</h3>
          <Grid data={history} style={{ maxHeight: 240 }}>
            <GridToolbar>
              <Button themeColor="error" icon="trash">Delete</Button>
            </GridToolbar>
            <Column field="createdOn" title="Creation Date" />
            <Column field="modifiedOn" title="Modified On" />
            <Column field="modifiedBy" title="Modified By" />
          </Grid>
        </div>
      </div>
    </div>
  );
}
