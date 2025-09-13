// ReportsPage.tsx - Updated with improved styling
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '@progress/kendo-react-inputs';
import { Pager, type PageChangeEvent } from '@progress/kendo-react-data-tools';

import StatisticsCards from '../components/dashboard/StatisticsCards';
import BaseCard from '../components/shared/BaseCard';
import CompanySelector from '../components/reports/CompanySelector';
import BaseButton from '../components/shared/BaseButton';
import BaseModal from '../components/shared/BaseModal';

import type { ReportStatistics, Company } from '../types';

import {
  copyIcon,
  trashIcon,
  pencilIcon,
  linkIcon,
  downloadIcon,
  plusOutlineIcon
} from '@progress/kendo-svg-icons';

/* ---------- AG Grid imports (Community) ---------- */
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import type {
  ColDef, ICellRendererParams,
  GridApi,
  ColumnApiModule,
  GridReadyEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
  RowClassParams,
  RowClickedEvent
} from 'ag-grid-community';

type ReportRow = {
  id: number;
  reportName: string;
  createdOn: string;
  modifiedOn: string;
  modifiedBy: string;
  active: boolean;
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

export default function ReportsPage() {
  const [company, setCompany] = React.useState<number | null>(null);
  const [query, setQuery] = React.useState<string>('');
  const [selectedReportId, setSelectedReportId] = React.useState<number | null>(null);
  const [columnApi, setColumnApi] = React.useState(null);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [gridApi, setGridApi] = React.useState<GridApi | null>(null);

  const navigate = useNavigate();

  // ---------- Demo data ----------

  const reports: ReportRow[] = React.useMemo(
    () => [
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
    ],
    []
  );

  const history: HistoryRow[] = [
    { id: 1, version: 'v1', createdOn: '17/7/2025', modifiedOn: '17/7/2025', modifiedBy: 'Atif', status: 'Published', reportId: 1 },
    { id: 2, version: 'v2', createdOn: '16/8/2025', modifiedOn: '17/8/2025', modifiedBy: 'Atif', status: 'Not Published', reportId: 1 },
    { id: 3, version: 'v1', createdOn: '18/7/2025', modifiedOn: '18/7/2025', modifiedBy: 'Kas', status: 'Published', reportId: 2 },
    { id: 4, version: 'v1', createdOn: '19/7/2025', modifiedOn: '19/7/2025', modifiedBy: 'Arooba', status: 'Not Published', reportId: 3 }
  ];

  // ---------- Filtering & KPIs ----------
  const visibleReports = React.useMemo(() => {
    if (company == null) return [];
    const q = query.trim().toLowerCase();
    return reports
      .filter(r => r.companyId === company)
      .filter(r => (q ? r.reportName.toLowerCase().includes(q) : true))
      .map(r => r)
  }, [reports, company, query]);

  const totals = React.useMemo<ReportStatistics[]>(() => {
    const totalReports = visibleReports.length;
    const activeReports = visibleReports.filter(r => r.active).length;
    const inactiveReports = totalReports - activeReports;
    return [
      { label: 'Total Reports', total: totalReports },
      { label: 'Active Reports', total: activeReports },
      { label: 'In-Active Reports', total: inactiveReports }
    ];
  }, [visibleReports]);

  // ---------- External paging (Reports) ----------
  const [page, setPage] = React.useState<{ skip: number; take: number }>({ skip: 0, take: 10 });
  const onPageChange = (e: PageChangeEvent) => setPage({ skip: e.skip, take: e.take });
  const pageData = React.useMemo(
    () => visibleReports.slice(page.skip, page.skip + page.take),
    [visibleReports, page]
  );

  // ---------- Versions (map to include boolean 'published') ----------
  const visibleVersions = React.useMemo(
    () =>
      selectedReportId == null
        ? []
        : history
          .filter(h => h.reportId === selectedReportId)
          .map(h => ({ ...h, published: h.status === 'Published' })),
    [history, selectedReportId]
  );

  // External paging (Versions)
  const [verPage, setVerPage] = React.useState<{ skip: number; take: number }>({ skip: 0, take: 10 });
  React.useEffect(() => { setVerPage(p => ({ ...p, skip: 0 })); }, [selectedReportId]);
  const onVersionsPageChange = (e: PageChangeEvent) => setVerPage({ skip: e.skip, take: e.take });
  const versionsPageData = React.useMemo(
    () => visibleVersions.slice(verPage.skip, verPage.skip + verPage.take),
    [visibleVersions, verPage]
  );

  // ---------- Company change ----------
  const handleCompanyChange = (c: Company | null) => {
    setCompany(c ? Number(c.id) : null);
    setSelectedReportId(null);
    setPage(p => ({ ...p, skip: 0 }));
  };

  // ---------- Action button component ----------
  const RowIconBtn: React.FC<{ icon: any; title: string; onClick: () => void }> = ({ icon, title, onClick }) => (
    <BaseButton
      size="small"
      rounded="full"
      fillMode="flat"
      themeColor="base"
      svgIcon={icon}
      title={title}
      onClick={onClick}
      className="!p-1.5 !text-gray-600 hover:!text-gray-800 hover:!bg-gray-100"
      color='none'
    />
  );

  // Reports action renderer
  const ReportActionsRenderer: React.FC<ICellRendererParams<ReportRow>> = (p) => {
    const row = p.data!;
    return (
      <div className="flex items-center gap-1.5">
        {/* <RowIconBtn icon={eyeIcon} title="View Versions" onClick={() => console.log('View Version', row.id)} /> */}
        <RowIconBtn icon={copyIcon} title="Copy" onClick={() => console.log('copy', row.id)} />
        <RowIconBtn icon={linkIcon} title="Link" onClick={() => console.log('link', row.id)} />
        <RowIconBtn icon={trashIcon} title="Delete" onClick={() => console.log('delete', row.id)} />
      </div>
    );
  };

  // Reports status checkbox renderer
  const StatusCheckboxRenderer: React.FC<ICellRendererParams<ReportRow, boolean>> = (p) => (
    <input type="checkbox" checked={!!p.value} readOnly className="cursor-default" />
  );

  // Versions published toggle
  const PublishedToggleRenderer: React.FC<ICellRendererParams<HistoryRow & { published: boolean }, boolean>> = (p) => {
    const value = !!p.value;
    const toggle = () => p.node.setDataValue('published', !value);
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={value} onChange={toggle} />
        <span className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-teal-400 relative">
          <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
        </span>
      </label>
    );
  };

  // Versions actions
  const VersionActionsRenderer: React.FC<ICellRendererParams<HistoryRow>> = (p) => {
    const row = p.data!;
    return (
      <div className="flex items-center gap-1.5">
        {/* <RowIconBtn icon={uploadIcon} title="Publish" onClick={() => console.log('publish', row.id)} /> */}
        <RowIconBtn icon={downloadIcon} title="Download" onClick={() => console.log('download', row.id)} />
        <RowIconBtn icon={plusOutlineIcon} title="New Version" onClick={() => console.log('New Version', row.id)} />
        <RowIconBtn icon={pencilIcon} title="Edit" onClick={() => console.log('edit', row.id)} />
        <RowIconBtn icon={trashIcon} title="Delete" onClick={() => console.log('delete', row.id)} />
      </div>
    );
  };

  // ---------- AG Grid column defs ----------
  const defaultColDef = React.useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
  }), []);

  const reportColDefs = React.useMemo<ColDef<ReportRow>[]>(() => [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      flex: 0,
      sortable: false,
      resizable: false
    },
    {
      headerName: 'Report Name',
      field: 'reportName',
      flex: 2,
      minWidth: 200
    },
    {
      headerName: 'Creation Date',
      field: 'createdOn',
      flex: 1,
      minWidth: 140
    },
    {
      headerName: 'Modified On',
      field: 'modifiedOn',
      flex: 1,
      minWidth: 140
    },
    {
      headerName: 'Modified By',
      field: 'modifiedBy',
      flex: 1,
      minWidth: 140
    },
    {
      headerName: 'Status',
      field: 'active',
      flex: 0,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      cellRenderer: StatusCheckboxRenderer,
      sortable: false
    },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 0,
      width: 220,
      minWidth: 220,
      maxWidth: 220,
      cellRenderer: ReportActionsRenderer,
      sortable: false
    }
  ], []);

  const versionsColDefs = React.useMemo<ColDef<(HistoryRow & { published: boolean })>[]>(() => [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      flex: 0,
      sortable: false,
      resizable: false
    },
    {
      headerName: 'Version',
      field: 'version',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Creation Date',
      field: 'createdOn',
      flex: 1,
      minWidth: 140
    },
    {
      headerName: 'Modified On',
      field: 'modifiedOn',
      flex: 1,
      minWidth: 140
    },
    {
      headerName: 'Modified By',
      field: 'modifiedBy',
      flex: 1,
      minWidth: 140
    },
    {
      headerName: 'Published',
      field: 'published',
      flex: 0,
      width: 100,
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: PublishedToggleRenderer,
      sortable: false
    },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 0,
      width: 260,
      minWidth: 180,
      maxWidth: 250,
      cellRenderer: VersionActionsRenderer,
      sortable: false
    }
  ], []);

  // Selected row styling
  const getRowStyle = React.useCallback(
    (p: RowClassParams) =>
      p.data?.id === selectedReportId
        ? { backgroundColor: '#c8e6c971' }  // --fg-green
        : undefined,
    [selectedReportId]
  );

  const gridOptions = {
    rowHeight: 40,
    headerHeight: 40,
  };

  function gridRowClicked(e: any) {
    console.log(e);
    console.log(e.node.isSelected());
    setSelectedReportId(e.data?.id ?? null);
  }

  function gridRowSelected(e: any) {
    console.log(e);
    console.log(e.node.isSelected());

    if (e.node.isSelected()) {
      setSelectedReportId(e.data.id);
    }
    else setSelectedReportId(null)
  }

  const onGridReady = (e: any) => {
    setGridApi(e.api);
    setColumnApi(e.columnApi);
  };

  const getRowClass = React.useCallback((p: any) => {
    return p.data?.id === selectedReportId ? 'selected-report-row' : '';
  }, [selectedReportId]);

  // Fires any time the selection set changes
  // const onSelectionChanged = (e: SelectionChangedEvent) => {
  //   const rows = e.api.getSelectedRows();      // all selected row data
  //   const ids = rows.map(r => r.id as number); // example: collect ids
  //   setSelectedIds(ids);
  //   console.log('Selected rows:', rows);
  // };


  // const getAllSelectedRows = () => gridApi?.getSelectedRows() ?? [];

  const [visible, setVisible] = React.useState<boolean>(false);


  const toggleDialog = () => {
    setVisible(!visible);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {visible && (
        <BaseModal
          title={"Please Confirm"}
          onClose={toggleDialog}
          body={
            <p className='text-center'>Are you sure you want to continue?</p>
          }
          actions={
            <>
              <BaseButton color='red' onClick={toggleDialog}>No</BaseButton>
              <BaseButton color='blue'onClick={toggleDialog}>Yes</BaseButton>
            </>
          }
        />
      )}



      <div className="p-5 px-25">
        {/* KPIs */}
        <StatisticsCards statistics={totals} />

        {/* Reports Card */}
        <BaseCard className="mt-5" dividers={false}>
          <BaseCard.Header>
            <div className="flex items-center gap-2">
              <CompanySelector onCompanyChange={handleCompanyChange} />
            </div>
            <div className="flex items-center gap-2">
              <BaseButton color="gray" svgIcon={copyIcon} title="Copy" onClick={toggleDialog}>Copy</BaseButton>
              <BaseButton color="red" svgIcon={trashIcon} title="Delete" onClick={() => console.log("Delete CLicked")}>Delete</BaseButton>
            </div>
          </BaseCard.Header>

          <BaseCard.Body className="space-y-4">
            <div>
              <Input
                placeholder="search 'report name'"
                value={query}
                onChange={(e) => setQuery(e.value)}
                disabled={company == null}
                className="w-full h-10 !bg-field"
              />
            </div>

            {/* AG Grid — Reports with improved styling */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div
                className="ag-theme-quartz"
                style={{ height: 420, width: '100%' }}
              >
                <AgGridReact<ReportRow>
                  rowData={pageData}
                  columnDefs={reportColDefs}
                  defaultColDef={defaultColDef}
                  rowSelection="multiple"
                  getRowId={p => String(p.data.id)}
                  onRowClicked={gridRowClicked}
                  getRowStyle={getRowStyle}
                  suppressHorizontalScroll={false}
                  suppressColumnVirtualisation={false}
                  suppressRowClickSelection={true}
                  animateRows={true}
                  gridOptions={gridOptions}
                  onGridReady={onGridReady}
                  onRowSelected={gridRowSelected}
                  suppressCellFocus={true}
                />
              </div>
            </div>
          </BaseCard.Body>

          <BaseCard.Footer>
            <span className="text-sm text-gray-500">
              {visibleReports.length
                ? `Showing ${page.skip + 1}-${Math.min(page.skip + page.take, visibleReports.length)} of ${visibleReports.length}`
                : `Showing 0–0 of 0`}
            </span>
            <Pager
              className="fg-pager"
              skip={page.skip}
              take={page.take}
              total={visibleReports.length}
              buttonCount={5}
              info={false}
              type="numeric"
              previousNext
              onPageChange={onPageChange}
              navigatable={false}
            />
          </BaseCard.Footer>
        </BaseCard>

        {/* Versions Card */}
        {selectedReportId != null && (
          <BaseCard className="mt-5" dividers={false}>
            <BaseCard.Header>
              <div className="flex items-center gap-2">
                <h3 className="font-bold">Version History</h3>
              </div>
              <div className="flex items-center gap-2">
                <BaseButton color="red" svgIcon={trashIcon} title="Delete" onClick={() => console.log("Delete CLicked")}>Delete</BaseButton>
              </div>
            </BaseCard.Header>

            <BaseCard.Body>
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <div
                  className="ag-theme-quartz"
                  style={{ height: 400, width: '100%' }}
                >
                  <AgGridReact<HistoryRow & { published: boolean }>
                    rowData={versionsPageData}
                    columnDefs={versionsColDefs}
                    defaultColDef={defaultColDef}
                    rowSelection="multiple"
                    getRowId={p => String(p.data.id)}
                    onRowClicked={() => navigate('/diagram')}
                    //getRowStyle={getRowStyle}
                    suppressHorizontalScroll={false}
                    suppressColumnVirtualisation={false}
                    animateRows={true}
                    gridOptions={gridOptions}
                  />
                </div>
              </div>
            </BaseCard.Body>

            <BaseCard.Footer>
              <span className="text-sm text-gray-500">
                {visibleVersions.length
                  ? `Showing ${verPage.skip + 1}-${Math.min(verPage.skip + verPage.take, visibleVersions.length)} of ${visibleVersions.length}`
                  : 'Showing 0–0 of 0'}
              </span>
              <Pager
                className="fg-pager"
                skip={verPage.skip}
                take={verPage.take}
                total={visibleVersions.length}
                buttonCount={5}
                info={false}
                type="numeric"
                previousNext
                onPageChange={onVersionsPageChange}
              />
            </BaseCard.Footer>
          </BaseCard>
        )}
      </div>
    </div>
  );
}