// components/reports/ReportsList.tsx
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input } from '@progress/kendo-react-inputs';
import { Pager, type PageChangeEvent } from '@progress/kendo-react-data-tools';

import BaseCard from '../shared/BaseCard';
import BaseButton from '../shared/BaseButton';
import BaseTable from '../shared/BaseTable';
import CompanySelector from './CompanySelector';
import CopyModal from '../modals/CopyModal';
import DeleteModal from '../modals/DeleteModal';
import LinkModal from '../modals/LinkModal';

import type { Company } from '../../types';
import type { Report as ReportRow } from '../../types';
import {
  setCurrentCompany,
  setQuery,
  setSelectedReportId,
  setSelectedReportIds,
  clearSelectedReportIds,
  setReportsPagination,
} from '../../features/reports/reportsSlice';

import {
  selectCurrentCompany,
  selectQuery,
  selectSelectedReportId,
  selectSelectedReportIds,
  selectFilteredReports,
  selectPaginatedReports,
  selectReportsPagination,
  selectHasMultipleReportsSelected,
} from '../../features/reports/reportsSelectors';

import {
  copyIcon,
  trashIcon,
  linkIcon,
} from '@progress/kendo-svg-icons';

import type {
  ColDef,
  ICellRendererParams,
  RowClassParams,
  RowClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';

export default function ReportsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const currentCompany = useSelector(selectCurrentCompany);
  const query = useSelector(selectQuery);
  const selectedReportId = useSelector(selectSelectedReportId);
  const selectedReportIds = useSelector(selectSelectedReportIds);
  const filteredReports = useSelector(selectFilteredReports);
  const paginatedReports = useSelector(selectPaginatedReports);
  const pagination = useSelector(selectReportsPagination);
  const hasMultipleSelected = useSelector(selectHasMultipleReportsSelected);

  // Modal states
  const [copyModal, setCopyModal] = React.useState({ isOpen: false, reportId: null as number | null, isMultiple: false });
  const [deleteModal, setDeleteModal] = React.useState({ isOpen: false, reportId: null as number | null, isMultiple: false });
  const [linkModal, setLinkModal] = React.useState({ isOpen: false, reportId: null as number | null });

  // Get report names for selected reports
  const getSelectedReportNames = () => {
    return filteredReports
      .filter(r => selectedReportIds.includes(Number(r.id)))
      .map(r => r.reportName);
  };

  const getReportById = (id: number) => {
    return filteredReports.find(r => r.id === id);
  };

  // Determine the appropriate empty message
  const getNoRowsMessage = () => {
    if (currentCompany == null) {
      return 'Please select a company to view reports';
    }
    if (query && filteredReports.length === 0) {
      return `No reports found matching "${query}"`;
    }
    if (filteredReports.length === 0) {
      return 'No reports available for this company';
    }
    return 'No rows to show';
  };

  // Action button component
  const RowIconBtn: React.FC<{ icon: any; title: string; onClick: (e: React.MouseEvent) => void }> = ({ icon, title, onClick }) => (
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

    const handleCopyClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      // Clear selections and highlighting
      dispatch(clearSelectedReportIds());
      dispatch(setSelectedReportId(null));
      setCopyModal({ isOpen: true, reportId: Number(row.id), isMultiple: false });
    };

    const handleLinkClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      // Clear selections and highlighting
      dispatch(clearSelectedReportIds());
      dispatch(setSelectedReportId(null));
      setLinkModal({ isOpen: true, reportId: Number(row.id) });
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      // Clear selections and highlighting
      dispatch(clearSelectedReportIds());
      dispatch(setSelectedReportId(null));
      setDeleteModal({ isOpen: true, reportId: Number(row.id), isMultiple: false });
    };

    return (
      <div className="flex items-center gap-1.5">
        <RowIconBtn icon={copyIcon} title="Copy" onClick={handleCopyClick} />
        <RowIconBtn icon={linkIcon} title="Link" onClick={handleLinkClick} />
        <RowIconBtn icon={trashIcon} title="Delete" onClick={handleDeleteClick} />
      </div>
    );
  };

  // Reports status checkbox renderer
  const StatusCheckboxRenderer: React.FC<ICellRendererParams<ReportRow, boolean>> = (p) => (
    <input type="checkbox" checked={!!p.value} readOnly className="cursor-default" />
  );

  // Column definitions
  const columnDefs = React.useMemo<ColDef<ReportRow>[]>(() => [
    {
      headerName: '',
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sortable: false,
      filter: false,
      suppressMenu: true,
      pinned: 'left',
    },
    {
      headerName: 'Report Name',
      field: 'reportName',
      flex: 2,
      minWidth: 140
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
      sortable: false,
      pinned: 'right',
    }
  ], []);

  // Event handlers
  const handleCompanyChange = (company: Company | null) => {
    dispatch(setCurrentCompany(company ? Number(company.id) : null));
  };

  const handleQueryChange = (e: any) => {
    dispatch(setQuery(e.value));
  };

  const handlePageChange = (e: PageChangeEvent) => {
    dispatch(setReportsPagination({ skip: e.skip, take: e.take }));
  };

  const handleRowClicked = (e: RowClickedEvent<ReportRow>) => {
    // Only set selected report for version history if not clicking on checkbox or action buttons
    if (e.event?.target &&
      !(e.event.target as HTMLElement).closest('.ag-checkbox-input') &&
      !(e.event.target as HTMLElement).closest('button')) {
      dispatch(setSelectedReportId(Number(e.data?.id) ?? null));
      // Clear multiple selections when clicking on a row
      dispatch(clearSelectedReportIds());
    }
  };

  const handleSelectionChanged = (e: SelectionChangedEvent<ReportRow>) => {
    const selectedRows = e.api.getSelectedRows();
    const selectedIds = selectedRows.map(row => Number(row.id));

    dispatch(setSelectedReportIds(selectedIds));

    // If multiple rows are selected, clear the single selected report ID
    if (selectedIds.length > 0) {
      dispatch(setSelectedReportId(null));
    }
  };

  // Row styling for clicked report (not selected via checkbox)
  const getRowStyle = React.useCallback(
    (p: RowClassParams) => {
      if (p.data?.id === selectedReportId && selectedReportIds.length === 0) {
        return { backgroundColor: '#c8e6c971' };
      }
      return undefined;
    },
    [selectedReportId, selectedReportIds]
  );

  const handleCopySelected = () => {
    setCopyModal({ isOpen: true, reportId: null, isMultiple: true });
  };

  const handleDeleteSelected = () => {
    setDeleteModal({ isOpen: true, reportId: null, isMultiple: true });
  };

  // Modal handlers
  const handleCopyConfirm = (destinationCompany: Company) => {
    const reportNames = copyModal.isMultiple ? getSelectedReportNames() : [getReportById(copyModal.reportId!)?.reportName || ''];
    console.log('Copy reports to company:', destinationCompany, 'Reports:', reportNames);
  };

  const handleDeleteConfirm = () => {
    const reportNames = deleteModal.isMultiple ? getSelectedReportNames() : [getReportById(deleteModal.reportId!)?.reportName || ''];
    console.log('Delete reports:', reportNames);

    if (deleteModal.isMultiple) {
      dispatch(clearSelectedReportIds());
    }
  };

  const handleLinkConfirm = (selectedPages: string[]) => {
    const report = getReportById(linkModal.reportId!);
    console.log('Link report to pages:', report?.reportName, selectedPages);
  };

  return (
    <>
      <BaseCard dividers={false}>
        <BaseCard.Header>
          <div className="flex items-center gap-2">
            <CompanySelector onCompanyChange={handleCompanyChange} />
          </div>
          <div className="flex items-center gap-2">
            <BaseButton
              color="gray"
              svgIcon={copyIcon}
              title="Copy"
              onClick={handleCopySelected}
              disabled={!hasMultipleSelected}
            >
              Copy
            </BaseButton>
            <BaseButton
              color="red"
              svgIcon={trashIcon}
              title="Delete"
              onClick={handleDeleteSelected}
              disabled={!hasMultipleSelected}
            >
              Delete
            </BaseButton>
          </div>
        </BaseCard.Header>

        <BaseCard.Body className="space-y-4">
          <div>
            <Input
              placeholder="search 'report name'"
              value={query}
              onChange={handleQueryChange}
              disabled={currentCompany == null}
              className="w-full h-10 !bg-field"
            />
          </div>

          <BaseTable<ReportRow>
            rowData={paginatedReports}
            columnDefs={columnDefs}
            getRowId={(p) => String(p.data.id)}
            onRowClicked={handleRowClicked}
            onSelectionChanged={handleSelectionChanged}
            getRowStyle={getRowStyle}
            height={420}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            noRowsOverlayComponent={() => (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-lg font-medium">{getNoRowsMessage()}</span>
                {currentCompany == null && (
                  <span className="text-sm mt-2">Use the dropdown above to get started</span>
                )}
              </div>
            )}
          />
        </BaseCard.Body>

        <BaseCard.Footer>
          <span className="text-sm text-gray-500">
            {filteredReports.length
              ? `Showing ${pagination.skip + 1}-${Math.min(pagination.skip + pagination.take, filteredReports.length)} of ${filteredReports.length}`
              : `Showing 0–0 of 0`}
          </span>
          <Pager
            className="fg-pager"
            skip={pagination.skip}
            take={pagination.take}
            total={filteredReports.length}
            buttonCount={5}
            info={false}
            type="numeric"
            previousNext
            onPageChange={handlePageChange}
            navigatable={false}
          />
        </BaseCard.Footer>
      </BaseCard>

      {/* Modals */}
      <CopyModal
        isOpen={copyModal.isOpen}
        onClose={() => setCopyModal({ isOpen: false, reportId: null, isMultiple: false })}
        onConfirm={handleCopyConfirm}
        reportNames={copyModal.isMultiple ? getSelectedReportNames() : copyModal.reportId ? [getReportById(copyModal.reportId)?.reportName || ''] : []}
        isMultiple={copyModal.isMultiple}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reportId: null, isMultiple: false })}
        onConfirm={handleDeleteConfirm}
        itemNames={deleteModal.isMultiple ? getSelectedReportNames() : deleteModal.reportId ? [getReportById(deleteModal.reportId)?.reportName || ''] : []}
        itemType={deleteModal.isMultiple ? 'reports' : 'report'}
      />

      <LinkModal
        isOpen={linkModal.isOpen}
        onClose={() => setLinkModal({ isOpen: false, reportId: null })}
        onConfirm={handleLinkConfirm}
        reportName={linkModal.reportId ? getReportById(linkModal.reportId)?.reportName || '' : ''}
      />
    </>
  );
}