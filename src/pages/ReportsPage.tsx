import * as React from 'react';
import { AppBar, AppBarSection } from '@progress/kendo-react-layout';
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
  type GridDataResult,
  type GridDataStateChangeEvent
} from '@progress/kendo-react-grid';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { process, type State as DataState, type DataResult } from '@progress/kendo-data-query';

// TEMP stub – replace with your DevExpress viewer component
const YourDevExpressViewer: React.FC = () => (
  <div className="dx-viewport" id="report-viewer" />
);

type ReportRow = {
  id: number;
  reportName: string;
  createdOn: string;
  modifiedOn: string;
  modifiedBy: string;
  active: boolean;
};

export default function ReportsPage(): JSX.Element {
  const [company, setCompany] = React.useState<string>('Eurotacs');
  const [query, setQuery] = React.useState<string>('');
  const [dataState, setDataState] = React.useState<DataState>({
    skip: 0,
    take: 10,
    sort: [],
    filter: undefined // use undefined, not null
  });

  const rows = React.useMemo<ReportRow[]>(
    () => [
      {
        id: 1,
        reportName: 'Loadlist',
        createdOn: '21.7.2024',
        modifiedOn: '25.7.2024',
        modifiedBy: 'Atif',
        active: true
      }
      // add more rows or fetch from API
    ],
    []
  );

  const gridData: GridDataResult = React.useMemo(() => {
    const state: DataState = {
      ...dataState,
      filter: query
        ? {
            logic: 'and',
            filters: [{ field: 'reportName', operator: 'contains', value: query }]
          }
        : undefined
    };
    // process(...) returns DataResult which is structurally compatible with GridDataResult
    return process(rows, state) as DataResult as GridDataResult;
  }, [rows, dataState, query]);

  const handleDataStateChange = React.useCallback(
    (e: GridDataStateChangeEvent) => setDataState(e.dataState),
    []
  );

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
        <Grid
          data={gridData}
          pageable
          sortable
          filterable
          {...dataState}
          onDataStateChange={handleDataStateChange}
          style={{ height: 420 }}
        >
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

      {/* DevExpress viewer area */}
      <div style={{ padding: 16 }}>
        <YourDevExpressViewer />
      </div>
    </div>
  );
}
