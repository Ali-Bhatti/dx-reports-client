import {
  useState,
  useMemo,
  useCallback,
  type MouseEvent,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '@progress/kendo-react-inputs';
import { Pager, type PageChangeEvent } from '@progress/kendo-react-data-tools';

import BaseCard from '../shared/BaseCard';
import BaseButton from '../shared/BaseButton';
import BaseTable from '../shared/BaseTable';
import CompanySelector from './CompanySelector';
import CopyModal from '../modals/CopyModal';
import DeleteModal from '../modals/DeleteModal';
import LinkModal from '../modals/LinkModal';
import { ActionButton, CheckboxRenderer } from '../table/renderers/CommonRenderers';
import { formatDateTime } from '../../utils/dateFormatters';
import { useNotifications } from '../../hooks/useNotifications';

import { useGetReportsQuery } from '../../services/report';

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
  selectReportsPagination,
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
  const { showNotification } = useNotifications();

  // Redux selectors
  const currentCompany = useSelector(selectCurrentCompany);
  const query = useSelector(selectQuery);
  const selectedReportId = useSelector(selectSelectedReportId);
  const selectedReportIds = useSelector(selectSelectedReportIds);
  const pagination = useSelector(selectReportsPagination);

  // RTK Query - Fetch reports data
  const {
    data: reportsResponse,
    isLoading: reportsLoading,
    isError: reportsError,
    error: _reportsErrorDetails,
  } = useGetReportsQuery(
    {
      companyId: currentCompany?.toString(),
      search: query || undefined
    },
    {
      skip: !currentCompany,
      refetchOnMountOrArgChange: true
    }
  );

  // Extract the actual reports array from the response
  // Adjust the property name based on your actual PaginatedResponse structure
  const allReports = useMemo(() => {
    if (!reportsResponse || !currentCompany) return [];

    // If reportsResponse is already an array (fallback)
    if (Array.isArray(reportsResponse)) {
      return reportsResponse;
    }

    return reportsResponse.data || [];
  }, [reportsResponse, currentCompany]);

  console.log('All Reports:-------', allReports);

  // Apply local pagination (since API might return all results)
  const paginatedReports = useMemo(() => {
    return allReports.slice(pagination.skip, pagination.skip + pagination.take);
  }, [allReports, pagination.skip, pagination.take]);

  // Check if multiple reports are selected
  const hasMultipleSelected = selectedReportIds.length > 0;

  // Modal states
  const [copyModal, setCopyModal] = useState({ isOpen: false, reportId: null as number | null, isMultiple: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reportId: null as number | null, isMultiple: false });
  const [linkModal, setLinkModal] = useState({ isOpen: false, reportId: null as number | null });

  // Helper functions
  const getSelectedReportNames = () => {
    return allReports
      .filter(r => selectedReportIds.includes(Number(r.id)))
      .map(r => r.reportName);
  };

  const getReportById = (id: number) => {
    return allReports.find(r => Number(r.id) === id);
  };

  const getNoRowsMessage = () => {
    if (currentCompany == null) {
      return 'Please select a company to view reports';
    }
    if (reportsLoading) {
      return 'Loading reports...';
    }
    if (reportsError) {
      return 'Error loading reports. Please try again.';
    }
    if (query && allReports.length === 0) {
      return `No reports found matching "${query}"`;
    }
    if (allReports.length === 0) {
      return 'No reports available for this company';
    }
    return 'No rows to show';
  };

  // Reports action renderer
  const ReportActionsRenderer = ({ data }: ICellRendererParams<ReportRow>) => {
    const row = data!;

    const handleCopyClick = (e: MouseEvent) => {
      e.stopPropagation();
      dispatch(clearSelectedReportIds());
      dispatch(setSelectedReportId(null));
      setCopyModal({ isOpen: true, reportId: Number(row.id), isMultiple: false });
    };

    const handleLinkClick = (e: MouseEvent) => {
      e.stopPropagation();
      dispatch(clearSelectedReportIds());
      dispatch(setSelectedReportId(null));
      setLinkModal({ isOpen: true, reportId: Number(row.id) });
    };

    const handleDeleteClick = (e: MouseEvent) => {
      e.stopPropagation();
      dispatch(clearSelectedReportIds());
      dispatch(setSelectedReportId(null));
      setDeleteModal({ isOpen: true, reportId: Number(row.id), isMultiple: false });
    };

    return (
      <div className="flex items-center gap-1.5">
        <ActionButton icon={copyIcon} title="Copy" onClick={handleCopyClick} />
        <ActionButton icon={linkIcon} title="Link" onClick={handleLinkClick} />
        <ActionButton icon={trashIcon} title="Delete" onClick={handleDeleteClick} />
      </div>
    );
  };

  // Column definitions
  const columnDefs = useMemo<ColDef<ReportRow>[]>(() => [
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
      minWidth: 140,
      valueFormatter: (params) => formatDateTime(params.value),
    },
    {
      headerName: 'Modified On',
      field: 'modifiedOn',
      flex: 1,
      minWidth: 140,
      valueFormatter: (params) => formatDateTime(params.value),
    },
    {
      headerName: 'Modified By',
      field: 'modifiedBy',
      flex: 1,
      minWidth: 140
    },
    {
      headerName: 'Migrated',
      field: 'merged',
      flex: 0,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      cellRenderer: CheckboxRenderer,
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
    // Clear selected reports when company changes
    dispatch(setSelectedReportId(null));
    dispatch(clearSelectedReportIds());
  };

  const handleQueryChange = (e: any) => {
    const newQuery = e.value;
    dispatch(setQuery(newQuery));

    // Show notification after data is loaded
    if (newQuery && newQuery.length > 2 && !reportsLoading) {
      const resultCount = allReports.length;
      if (resultCount === 0) {
        showNotification('warning', `No reports found matching "<strong>${newQuery}</strong>"`);
      }
    }
  };

  const handlePageChange = (e: PageChangeEvent) => {
    dispatch(setReportsPagination({ skip: e.skip, take: e.take }));
  };

  const handleRowClicked = (e: RowClickedEvent<ReportRow>) => {
    if (e.event?.target &&
      !(e.event.target as HTMLElement).closest('.ag-checkbox-input') &&
      !(e.event.target as HTMLElement).closest('button')) {
      dispatch(setSelectedReportId(Number(e.data?.id) ?? null));
      dispatch(clearSelectedReportIds());
    }
  };

  const handleSelectionChanged = (e: SelectionChangedEvent<ReportRow>) => {
    const selectedRows = e.api.getSelectedRows();
    const selectedIds = selectedRows.map(row => Number(row.id));

    dispatch(setSelectedReportIds(selectedIds));

    if (selectedIds.length > 0) {
      dispatch(setSelectedReportId(null));
    }
  };

  const getRowStyle = useCallback(
    (p: RowClassParams) => {
      if (+p.data?.id === selectedReportId && selectedReportIds.length === 0) {
        return { backgroundColor: '#c8e6c971' };
      }
      return undefined;
    },
    [selectedReportId, selectedReportIds]
  );

  const handleCopySelected = () => {
    if (selectedReportIds.length === 0) {
      showNotification('warning', 'Please select reports to copy');
      return;
    }
    setCopyModal({ isOpen: true, reportId: null, isMultiple: true });
  };

  const handleDeleteSelected = () => {
    if (selectedReportIds.length === 0) {
      showNotification('warning', 'Please select reports to delete');
      return;
    }
    setDeleteModal({ isOpen: true, reportId: null, isMultiple: true });
  };

  // Modal handlers
  const handleCopyConfirm = async (destinationCompany: Company) => {
    try {
      const reportNames = copyModal.isMultiple ? getSelectedReportNames() : [getReportById(copyModal.reportId!)?.reportName || ''];

      console.log('Copy reports to company:', destinationCompany, 'Reports:', reportNames);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const reportCount = reportNames.length;
      const reportText = reportCount === 1 ? 'report' : 'reports';

      showNotification('success', `Successfully copied <strong>${reportCount} ${reportText}</strong> to <strong>${destinationCompany.name}</strong>`);

      setCopyModal({ isOpen: false, reportId: null, isMultiple: false });

      if (copyModal.isMultiple) {
        dispatch(clearSelectedReportIds());
      }
    } catch (error) {
      showNotification('error', 'Failed to copy reports. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const reportNames = deleteModal.isMultiple ? getSelectedReportNames() : [getReportById(deleteModal.reportId!)?.reportName || ''];

      console.log('Delete reports:', reportNames);
      await new Promise(resolve => setTimeout(resolve, 800));

      const reportCount = reportNames.length;
      const reportText = reportCount === 1 ? 'report' : 'reports';

      showNotification('success', `Successfully deleted <strong>${reportCount} ${reportText}</strong>`);

      setDeleteModal({ isOpen: false, reportId: null, isMultiple: false });

      if (deleteModal.isMultiple) {
        dispatch(clearSelectedReportIds());
      }
    } catch (error) {
      showNotification('error', 'Failed to delete reports. Please try again.');
    }
  };

  const handleLinkConfirm = async (selectedPages: string[]) => {
    try {
      const report = getReportById(linkModal.reportId!);

      console.log('Link report to pages:', report?.reportName, selectedPages);
      await new Promise(resolve => setTimeout(resolve, 600));

      const pageCount = selectedPages.length;
      const pageText = pageCount === 1 ? 'page' : 'pages';

      showNotification(
        'success',
        `Successfully linked <strong>${report?.reportName}</strong> to <strong>${pageCount} ${pageText}</strong>`
      );

      setLinkModal({ isOpen: false, reportId: null });
    } catch (error) {
      showNotification('error', 'Failed to link report to pages. Please try again.');
    }
  };

  const tableKey = useMemo(() => {
    return `${selectedReportId}-${selectedReportIds.length}-${currentCompany}`;
  }, [currentCompany]);

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
            //key={tableKey}
            rowData={paginatedReports}
            columnDefs={columnDefs}
            getRowId={(p) => String(p.data.id)}
            onRowClicked={handleRowClicked}
            onSelectionChanged={handleSelectionChanged}
            getRowStyle={getRowStyle}
            height={420}
            rowSelection={"multiple"}
            suppressRowClickSelection={true}
            loading={reportsLoading}
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
            {allReports.length
              ? `Showing ${pagination.skip + 1}-${Math.min(pagination.skip + pagination.take, allReports.length)} of ${allReports.length}`
              : `Showing 0–0 of 0`}
          </span>
          <Pager
            className="fg-pager"
            skip={pagination.skip}
            take={pagination.take}
            total={allReports.length}
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