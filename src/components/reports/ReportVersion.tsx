import * as React from 'react';
import { Pager, type PageChangeEvent } from '@progress/kendo-react-data-tools';
import {
  downloadIcon,
  pencilIcon,
  plusOutlineIcon,
  trashIcon,
} from '@progress/kendo-svg-icons';
import type {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import BaseCard from '../shared/BaseCard';
import BaseTable from '../shared/BaseTable';
import BaseButton from '../shared/BaseButton';
import type { ReportVersionItem } from '../../data/reportData';

export type ReportVersionProps = {
  versions: ReportVersionItem[];
  pageData: ReportVersionItem[];
  total: number;
  page: { skip: number; take: number };
  onPageChange: (event: PageChangeEvent) => void;
  onRowClick?: (version: ReportVersionItem) => void;
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

const ReportVersion: React.FC<ReportVersionProps> = ({
  versions,
  pageData,
  total,
  page,
  onPageChange,
  onRowClick,
  loading = false,
}) => {
  const gridApiRef = React.useRef<GridReadyEvent<ReportVersionItem>["api"] | null>(null);

  const handleGridReady = React.useCallback((event: GridReadyEvent<ReportVersionItem>) => {
    gridApiRef.current = event.api;
  }, []);

  const handleRowClicked = React.useCallback(
    (event: any) => {
      if (!onRowClick) return;
      const row = event.data as ReportVersionItem | undefined;
      if (row) onRowClick(row);
    },
    [onRowClick]
  );

  const colDefs = React.useMemo<ColDef<ReportVersionItem>[]>(() => [
    {
      headerName: 'Version',
      field: 'version',
      flex: 1,
      minWidth: 120,
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
      headerName: 'Published',
      field: 'published',
      flex: 0,
      width: 110,
      minWidth: 110,
      maxWidth: 110,
      sortable: false,
      cellRenderer: (params: ICellRendererParams<ReportVersionItem, boolean>) => {
        const value = Boolean(params.value);
        const toggle = () => params.node.setDataValue('published', !value);
        return (
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={value} onChange={toggle} />
            <span className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-teal-400 relative">
              <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
            </span>
          </label>
        );
      },
    },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 0,
      width: 260,
      minWidth: 220,
      maxWidth: 260,
      sortable: false,
      cellRenderer: (params: ICellRendererParams<ReportVersionItem>) => {
        const row = params.data;
        if (!row) return null;
        return (
          <div className="flex items-center gap-1.5">
            <RowActionButton icon={downloadIcon} title="Download" onClick={() => console.log('download', row.id)} />
            <RowActionButton icon={plusOutlineIcon} title="New Version" onClick={() => console.log('new version', row.id)} />
            <RowActionButton icon={pencilIcon} title="Edit" onClick={() => console.log('edit', row.id)} />
            <RowActionButton icon={trashIcon} title="Delete" onClick={() => console.log('delete', row.id)} />
          </div>
        );
      },
    },
  ], []);

  const overlayText = React.useMemo(() => {
    if (loading) return 'Loading versions...';
    if (!versions.length) return 'Select a report to view versions';
    return 'No versions found';
  }, [loading, versions.length]);

  return (
    <>
      <BaseCard.Body>
        <BaseTable<ReportVersionItem>
          rowData={loading ? [] : pageData}
          columnDefs={colDefs}
          getRowId={params => String(params.data?.id ?? '')}
          onRowClicked={handleRowClicked}
          onGridReady={handleGridReady}
          height={400}
          showCheckboxColumn={false}
          gridOptions={{
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
        />
      </BaseCard.Footer>
    </>
  );
};

export default ReportVersion;
