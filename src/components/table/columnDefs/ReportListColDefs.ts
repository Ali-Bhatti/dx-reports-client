import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { YesNoRenderer } from '../renderers';
import YesNoCheckboxFilter from '../filters/YesNoCheckboxFilter';
import { formatDateTime } from '../../../utils/dateFormatters';
import type { Report as ReportRow } from '../../../types';

interface ReportListColDefsConfig {
  createReportActionsRenderer: (props: ICellRendererParams<ReportRow>) => React.JSX.Element;
}

export const getReportListColumnDefs = ({ 
  createReportActionsRenderer 
}: ReportListColDefsConfig): ColDef<ReportRow>[] => [
  {
    headerName: 'Report Name',
    field: 'reportName',
    flex: 2,
    minWidth: 140,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: 'left',
  },
  {
    headerName: 'Creation Date',
    field: 'createdOn',
    flex: 1,
    minWidth: 140,
    valueFormatter: (params) => { 
      if(!params.value) return '--';
      return formatDateTime(params.value);
    },
  },
  {
    headerName: 'Modified On',
    field: 'modifiedOn',
    flex: 1,
    minWidth: 140,
    valueFormatter: (params) => { 
      if(!params.value) return '--';
      return formatDateTime(params.value);
    },
  },
  {
    headerName: 'Modified By',
    field: 'modifiedBy',
    flex: 1,
    minWidth: 140,
    valueFormatter: (params) => { 
      if(!params.value) return '--';
      return params.value;
    },
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
    pinned: 'right',
  }
];