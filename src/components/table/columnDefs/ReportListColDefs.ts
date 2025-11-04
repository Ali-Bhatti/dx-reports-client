import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { YesNoRenderer } from '../renderers';
import YesNoCheckboxFilter from '../filters/YesNoCheckboxFilter';
import { formatDateTime } from '../../../utils/dateFormatters';
import type { Report as ReportRow } from '../../../types';

interface ReportListColDefsConfig {
  createReportActionsRenderer: (props: ICellRendererParams<ReportRow>) => React.JSX.Element;
}
const isMobile = () => window.innerWidth < 640;

export const getReportListColumnDefs = ({
  createReportActionsRenderer
}: ReportListColDefsConfig): ColDef<ReportRow>[] => [
  {
    headerName: 'Report Name',
    field: 'reportName',
    flex: 2,
    width: 400,
    maxWidth: 400,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: isMobile() ? null : 'left',
  },
  {
    headerName: 'Creation Date',
    field: 'creationDate',
    flex: 1,
    minWidth: 140,
    valueFormatter: (params) => { 
      if(!params.value) return '--';
      return formatDateTime(params.value);
    },
  },
  {
    headerName: 'Modified On',
    field: 'modificationDate',
    flex: 1,
    minWidth: 140,
    valueFormatter: (params) => formatDateTime(params.value, "--"),
  },
  {
    headerName: 'Modified By',
    field: 'editorId',
    flex: 1,
    minWidth: 140,
    valueFormatter: (params) => params.value || '--',
  },
  {
    headerName: 'Migrated',
    field: 'merged',
    flex: 0,
    width: 120,
    minWidth: 80,
    maxWidth: 140,
    cellRenderer: YesNoRenderer,
    sortable: false,
    filter: YesNoCheckboxFilter,
  },
  {
    headerName: 'Actions',
    field: 'id',
    flex: 0,
    width: 220,
    minWidth: 220,
    maxWidth: 220,
    cellRenderer: createReportActionsRenderer,
    sortable: false,
    filter: false,
    pinned: isMobile() ? null : 'right',
  }
];