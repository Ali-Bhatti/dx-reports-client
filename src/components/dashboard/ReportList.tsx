import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '@progress/kendo-react-inputs';

import BaseCard from '../shared/BaseCard';
import BaseButton from '../shared/BaseButton';
import BaseTable from '../shared/BaseTable';
import CompanySelector from './CompanySelector';
import CopyModal from '../modals/CopyModal';
import DeleteModal from '../modals/DeleteModal';
import LinkModal from '../modals/LinkModal';
import { ReportActionsRenderer } from '../table/renderers';
import EmptyStateRenderer from '../table/renderers/EmptyStateRenderer';
import { getReportListColumnDefs } from '../table/columnDefs';
import { useNotifications } from '../../hooks/useNotifications';

import { useGetReportsQuery, useDeleteReportsMutation } from '../../services/report';

import type { Company, Report as ReportRow } from '../../types';
import { pluralize } from '../../utils/pluralize';

import {
  setCurrentCompany,
  setQuery,
  setSelectedReportId,
  setSelectedReportIds,
  clearSelectedReportIds,
  setSelectedReport,
} from '../../features/reports/reportsSlice';

import {
  selectCurrentCompany,
  selectQuery,
  selectSelectedReportId,
  selectSelectedReportIds,
} from '../../features/reports/reportsSelectors';

import {
  copyIcon,
  trashIcon,
  filterClearIcon,
} from '@progress/kendo-svg-icons';

import type {
  ICellRendererParams,
  RowClassParams,
  RowClickedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';

export default function ReportsList() {
  const dispatch = useDispatch();
  const { showNotification } = useNotifications();
  const gridRef = useRef<any>(null);

  const onGridReady = (params: any) => {
    gridRef.current = params.api;
  };

  // Redux selectors
  const currentCompany = useSelector(selectCurrentCompany);
  const query = useSelector(selectQuery);
  const selectedReportId = useSelector(selectSelectedReportId);
  const selectedReportIds = useSelector(selectSelectedReportIds);

  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Restore selected company from localStorage on mount
  useEffect(() => {
    const savedCompanyId = localStorage.getItem('selectedCompanyId');
    if (savedCompanyId && !currentCompany) {
      dispatch(setCurrentCompany(Number(savedCompanyId)));
    }
  }, [dispatch, currentCompany]);

  const {
    data: reportsResponse,
    isLoading: reportsLoading,
    isFetching: reportsFetching,
    isError: reportsError,
    error: _reportsErrorDetails,
  } = useGetReportsQuery(
    {
      companyId: currentCompany?.toString()
    },
    {
      skip: !currentCompany,
      refetchOnMountOrArgChange: true
    }
  );

  const [deleteReports, { isLoading: isDeleting }] = useDeleteReportsMutation();

  const isLoadingReports = reportsLoading || reportsFetching;

  // Extract the actual reports array from the response
  const allReports = useMemo(() => {
    if (!reportsResponse || !currentCompany || reportsError) return [];

    if (Array.isArray(reportsResponse)) {
      return reportsResponse;
    }

    return reportsResponse.data || [];
  }, [reportsResponse, currentCompany, reportsError]);

  const searchFilteredReports = useMemo(() => {
    let reports = allReports;
    // Apply search filter
    if (query && query.trim().length > 0) {
      const lowerQuery = query.trim().toLowerCase();
      reports = reports.filter(r => r.reportName?.toLowerCase().includes(lowerQuery));
    }
    return reports;
  }, [allReports, query]);

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

  const getNoRowsMessage = (): string => {
    if (isLoadingReports) {
      return 'Loading reports...';
    }

    if (currentCompany == null) {
      return 'Please select a company to view reports';
    }

    if (reportsError) {
      return 'Error loading reports. Please try again.';
    }

    if (query && query.trim().length > 0 && searchFilteredReports.length === 0) {
      return `No reports found matching "${query}"`;
    }

    if (allReports.length === 0 && currentCompany) {
      return 'No reports available for this company';
    }

    return 'No rows to show';
  };

  // Action handlers for the renderer
  const handleReportCopy = (reportId: number) => {
    setCopyModal({ isOpen: true, reportId, isMultiple: false });
  };

  const handleReportLink = (reportId: number) => {
    setLinkModal({ isOpen: true, reportId });
  };

  const handleReportDelete = (reportId: number) => {
    setDeleteModal({ isOpen: true, reportId, isMultiple: false });
  };

  // Create renderer with callbacks
  const createReportActionsRenderer = (props: ICellRendererParams<ReportRow>) => {
    return ReportActionsRenderer({
      ...props,
      onCopy: handleReportCopy,
      onLink: handleReportLink,
      onDelete: handleReportDelete,
    });
  };

  // Column definitions using the separate module
  const columnDefs = useMemo(() => {
    return getReportListColumnDefs({
      createReportActionsRenderer
    });
  }, []);

  // Event handlers
  const handleCompanyChange = (company: Company | null) => {
    if (company) {
      localStorage.setItem('selectedCompanyId', String(company.id));
      dispatch(setCurrentCompany(Number(company.id)));
    } else {
      localStorage.removeItem('selectedCompanyId');
      dispatch(setCurrentCompany(null));
    }
    // Clear selected reports when company changes
    dispatch(setSelectedReportId(null));
    dispatch(setSelectedReport(null));
    dispatch(clearSelectedReportIds());
  };

  const handleQueryChange = (e: any) => {
    const newQuery = e.value;
    dispatch(setQuery(newQuery));
    // Show notification after data is loaded
    if (newQuery && newQuery.length > 2 && !isLoadingReports) {
      const resultCount = searchFilteredReports.length;
      if (resultCount === 0) {
        showNotification('warning', `No reports found matching "<strong>${newQuery}</strong>"`);
      }
    }
  };

  const handleRowClicked = (e: RowClickedEvent<ReportRow>) => {
    if (e.event?.target &&
      !(e.event.target as HTMLElement).closest('.ag-checkbox-input') &&
      !(e.event.target as HTMLElement).closest('button')) {

      // Clear all multi-selections when clicking on a row
      dispatch(clearSelectedReportIds());
      if (gridRef?.current) {
        gridRef.current.deselectAll();
      }

      // Set the single selected report
      dispatch(setSelectedReportId(Number(e.data?.id) ?? null));
      dispatch(setSelectedReport(e.data ?? null));
    }
  };

  const handleSelectionChanged = (e: SelectionChangedEvent<ReportRow>) => {
    const selectedRows = e.api.getSelectedRows();
    const selectedIds = selectedRows.map(row => Number(row.id));

    dispatch(setSelectedReportIds(selectedIds));

    if (selectedIds.length > 0) {
      dispatch(setSelectedReportId(null));
      dispatch(setSelectedReport(null));
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

  const handleClearAllFilters = () => {
    if (gridRef?.current) {
      gridRef.current.setFilterModel(null);
      setHasActiveFilters(false);
    }
  };

  const checkFilterState = () => {
    console.log('Checking filter state...', gridRef.current);
    if (!gridRef.current) return;
    const filterModel = gridRef.current.getFilterModel();
    setHasActiveFilters(Object.keys(filterModel).length > 0);
  };

  // Modal handlers
  const handleCopyConfirm = async (destinationCompany: Company) => {
    try {
      const reportNames = copyModal.isMultiple ? getSelectedReportNames() : [getReportById(copyModal.reportId!)?.reportName || ''];

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
    const reportNames = deleteModal.isMultiple ? getSelectedReportNames() : [getReportById(deleteModal.reportId!)?.reportName || ''];
    const reportCount = reportNames.length;
    try {
      const reportIds = deleteModal.isMultiple
        ? selectedReportIds.map(id => String(id))
        : [String(deleteModal.reportId!)];

      await deleteReports({ reportIds }).unwrap();

      showNotification('success', `Successfully deleted <strong>${reportCount} ${pluralize(reportCount, 'report')}</strong>`);

      setDeleteModal({ isOpen: false, reportId: null, isMultiple: false });

      if (deleteModal.isMultiple) {
        dispatch(clearSelectedReportIds());
      }
      if (gridRef?.current) {
        gridRef.current.deselectAll();
      }
    } catch (error: any) {
      showNotification('error', `Failed to delete ${pluralize(reportCount, 'report')}. Please try again. <br/> ${error?.data?.message}`);
    }
  };

  const handleLinkConfirm = async (selectedPages: string[]) => {
    try {
      const report = getReportById(linkModal.reportId!);

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

  // const tableKey = useMemo(() => {
  //   return `${selectedReportId}-${selectedReportIds.length}-${currentCompany}`;
  // }, [selectedReportId, selectedReportIds.length, currentCompany]);

  return (
    <>
      <BaseCard dividers={false}>
        <BaseCard.Header>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <CompanySelector onCompanyChange={handleCompanyChange} restoreSavedCompany={true} className="flex-1 sm:flex-initial" />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <BaseButton
              color="gray"
              svgIcon={copyIcon}
              title="Copy"
              onClick={handleCopySelected}
              disabled={!hasMultipleSelected}
            >
              <span className="hidden sm:inline">Copy</span>
            </BaseButton>
            <BaseButton
              color="red"
              svgIcon={trashIcon}
              title="Delete"
              onClick={handleDeleteSelected}
              disabled={!hasMultipleSelected}
            >
              <span className="hidden sm:inline">Delete</span>
            </BaseButton>
          </div>
        </BaseCard.Header>

        <BaseCard.Body className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input
              placeholder="search 'report name'"
              value={query}
              onChange={handleQueryChange}
              disabled={currentCompany == null}
              className="w-full h-10 !bg-field"
            />
            <BaseButton
              color="gray"
              svgIcon={filterClearIcon}
              title="Clear All Filters"
              onClick={handleClearAllFilters}
              disabled={!hasActiveFilters}
              className="whitespace-nowrap"
            >
              <span className="hidden sm:inline">Clear All Filters</span>
            </BaseButton>
          </div>

          <BaseTable<ReportRow>
            //key={tableKey}
            onGridReady={onGridReady}
            rowData={searchFilteredReports}
            columnDefs={columnDefs}
            getRowId={(p) => String(p.data.id)}
            onRowClicked={handleRowClicked}
            onSelectionChanged={handleSelectionChanged}
            onFilterChanged={checkFilterState}
            getRowStyle={getRowStyle}
            height={420}
            rowSelection={"multiple"}
            suppressRowClickSelection={true}
            loading={isLoadingReports}
            noRowsOverlayComponent={() => (
              <EmptyStateRenderer
                message={getNoRowsMessage()}
                subMessage={currentCompany == null ? 'Use the dropdown above to get started' : undefined}
              />
            )}
          />
        </BaseCard.Body>

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
        isLoading={isDeleting}
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