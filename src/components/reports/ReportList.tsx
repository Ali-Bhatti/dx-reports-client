import * as React from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Pager, type PageChangeEvent } from '@progress/kendo-react-data-tools';
import {
  copyIcon,
  linkIcon,
  trashIcon,
} from '@progress/kendo-svg-icons';
import type {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  RowClassParams,
} from 'ag-grid-community';
import BaseCard from '../shared/BaseCard';
import BaseTable from '../shared/BaseTable';
import BaseButton from '../shared/BaseButton';
import type { ReportListItem } from '../../data/reportData';

export type ReportListProps = {
  pageData: ReportListItem[];
  total: number;
  page: { skip: number; take: number };
  onPageChange: (event: PageChangeEvent) => void;
  query: string;
  onQueryChange: (value: string) => void;
  selectedReportId: number | null;
  onSelectReport: (reportId: number | null) => void;
  disabled?: boolean;
  loading?: boolean;
};

const RowActionButton: React.FC<{
  icon: any;
  title: string;
  onClick: () => void;
}> = ({ icon, title, onClick }) => (
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

const ReportList: React.FC<ReportListProps> = ({
  pageData,
  total,
  page,
  onPageChange,
  query,
  onQueryChange,
  selectedReportId,
  onSelectReport,
  disabled = false,
  loading = false,
}) => {
  const gridApiRef = React.useRef<GridReadyEvent<ReportListItem>["api"] | null>(null);

  const handleGridReady = React.useCallback((event: GridReadyEvent<ReportListItem>) => {
    gridApiRef.current = event.api;
  }, []);

  const handleRowClicked = React.useCallback(
    (event: any) => {
      const reportId = event.data?.id ?? null;
      onSelectReport(reportId);
    },
    [onSelectReport]
  );

  const handleSelectionChanged = React.useCallback(() => {
    if (!gridApiRef.current) return;
    const selected = gridApiRef.current.getSelectedRows?.() ?? [];
    const first = selected[0] as ReportListItem | undefined;
    onSelectReport(first?.id ?? null);
  }, [onSelectReport]);

  React.useEffect(() => {
    const api = gridApiRef.current;
    if (!api) return;

    if (selectedReportId == null) {
      api.deselectAll?.();
      return;
    }

    api.forEachNode?.(node => {
      const isMatch = node.data?.id === selectedReportId;
      if (isMatch && !node.isSelected()) {
        node.setSelected(true);
      } else if (!isMatch && node.isSelected()) {
        node.setSelected(false);
      }
    });
  }, [selectedReportId, pageData]);

  const colDefs = React.useMemo<ColDef<ReportListItem>[]>(() => [
    {
      headerName: 'Report Name',
      field: 'reportName',
      flex: 2,
      minWidth: 160,
    },
    {
      headerName: 'Creation Date',
      field: 'createdOn',
      flex: 1,
      minWidth: 140,
    },
    {
      headerName: 'Modified On',
      field: 'modifiedOn',
      flex: 1,
      minWidth: 140,
    },
    {
      headerName: 'Modified By',
      field: 'modifiedBy',
      flex: 1,
      minWidth: 140,
    },
    {
      headerName: 'Status',
      field: 'active',
      flex: 0,
      width: 90,
      minWidth: 90,
      maxWidth: 90,
      cellRenderer: (params: ICellRendererParams<ReportListItem, boolean>) => (
        <input type="checkbox" checked={Boolean(params.value)} readOnly className="cursor-default" />
      ),
      sortable: false,
    },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 0,
      width: 220,
      minWidth: 220,
      maxWidth: 220,
      cellRenderer: (params: ICellRendererParams<ReportListItem>) => {
        const row = params.data;
        if (!row) return null;
        return (
          <div className="flex items-center gap-1.5">
            <RowActionButton icon={copyIcon} title="Copy" onClick={() => console.log('copy', row.id)} />
            <RowActionButton icon={linkIcon} title="Link" onClick={() => console.log('link', row.id)} />
            <RowActionButton icon={trashIcon} title="Delete" onClick={() => console.log('delete', row.id)} />
          </div>
        );
      },
      sortable: false,
    },
  ], []);

  const rowClass = React.useCallback(
    (params: RowClassParams<ReportListItem>) => (
      params.data?.id === selectedReportId ? { backgroundColor: '#c8e6c971' } : undefined
    ),
    [selectedReportId]
  );

  const overlayText = React.useMemo(() => {
    if (disabled) return 'Select a company to view reports';
    if (loading) return 'Loading reports...';
    return 'No reports found';
  }, [disabled, loading]);

  return (
    <>
      <BaseCard.Body className="space-y-4">
        <Input
          placeholder="search 'report name'"
          value={query}
          onChange={(event) => onQueryChange(event.value)}
          disabled={disabled}
          className="w-full h-10 !bg-field"
        />

        <BaseTable<ReportListItem>
          rowData={loading ? [] : pageData}
          columnDefs={colDefs}
          getRowId={params => String(params.data?.id ?? '')}
          onRowClicked={handleRowClicked}
          onSelectionChanged={handleSelectionChanged}
          getRowStyle={rowClass}
          onGridReady={handleGridReady}
          height={420}
          showCheckboxColumn={false}
          gridOptions={{
            rowSelection: {
              mode: 'singleRow',
              checkboxes: false,
              enableClickSelection: true,
            },
            overlayNoRowsTemplate: `<span class="text-gray-500">${overlayText}</span>`,
          }}
        />
      </BaseCard.Body>

      <BaseCard.Footer>
        <span className="text-sm text-gray-500">
          {total
            ? `Showing ${page.skip + 1}-${Math.min(page.skip + page.take, total)} of ${total}`
            : 'Showing 0–0 of 0'}
        </span>
        <Pager
          className="fg-pager"
          skip={page.skip}
          take={page.take}
          total={total}
          buttonCount={5}
          info={false}
          type="numeric"
          previousNext
          onPageChange={onPageChange}
          navigatable={false}
        />
      </BaseCard.Footer>
    </>
  );
};

export default ReportList;
