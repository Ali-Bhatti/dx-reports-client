import * as React from 'react';
import { AppBar, AppBarSection } from '@progress/kendo-react-layout';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
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
};
export default function ReportsPage() {
  const [company, setCompany] = React.useState<string>('Eurotacs');
  const [query, setQuery] = React.useState<string>('');

  const rows: ReportRow[] = [
    {
      id: 1,
      reportName: 'Loadlist',
      createdOn: '21.7.2024',
      modifiedOn: '25.7.2024',
      modifiedBy: 'Atif',
      active: true
    }
    // add more rows or fetch from API
  ];

  const filteredRows = query
    ? rows.filter((row) =>
        row.reportName.toLowerCase().includes(query.toLowerCase())
      )
    : rows;

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

      <div style={{ display: 'flex', gap: 12, padding: 16 }}>
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
      </div>

      <div style={{ padding: 16 }}>
        <Grid data={filteredRows} style={{ height: 420 }}>
          <GridToolbar>
            <Button themeColor="error" icon="trash">
              Delete
            </Button>
            <Button icon="copy">Copy</Button>
          </GridToolbar>

          <Column field="reportName" title="Report Name" />
          <Column field="createdOn" title="Creation Date" />
          <Column field="modifiedOn" title="Modified On" />
          <Column field="modifiedBy" title="Modified By" />
        </Grid>
      </div>

    </div>
  );
}
