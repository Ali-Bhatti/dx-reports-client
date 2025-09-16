import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import BaseCard from '../components/shared/BaseCard';
import CompanySelector from '../components/reports/CompanySelector';
import BaseButton from '../components/shared/BaseButton';
import BaseModal from '../components/shared/BaseModal';
import ReportList from '../components/reports/ReportList';
import ReportVersion from '../components/reports/ReportVersion';
import {
  copyIcon,
  trashIcon,
} from '@progress/kendo-svg-icons';
import type { Company } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { reportsActions } from '../store/reportsSlice';
import { reportVersionsActions } from '../store/reportVerisonSlice';
import {
  fetchCompanyKpis,
  fetchReportVersions,
  fetchReportsByCompany,
  type ReportListItem,
} from '../data/reportData';
import type { PageChangeEvent } from '@progress/kendo-react-data-tools';

const PAGE_SIZE = 10;
const VERSION_PAGE_SIZE = 10;

type PageState = { skip: number; take: number };

const initialPageState: PageState = { skip: 0, take: PAGE_SIZE };
const initialVersionPageState: PageState = { skip: 0, take: VERSION_PAGE_SIZE };

export default function ReportsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reportsState = useAppSelector(state => state.reports);
  const versionsState = useAppSelector(state => state.reportVersions);

  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState<PageState>(initialPageState);
  const [versionPage, setVersionPage] = React.useState<PageState>(initialVersionPageState);
  const [modalVisible, setModalVisible] = React.useState(false);

  const reportListDisabled = reportsState.selectedCompanyId == null;

  const filteredReports = React.useMemo<ReportListItem[]>(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return reportsState.reports;
    return reportsState.reports.filter(report =>
      report.reportName.toLowerCase().includes(normalized)
    );
  }, [query, reportsState.reports]);

  const pagedReports = React.useMemo(
    () => filteredReports.slice(page.skip, page.skip + page.take),
    [filteredReports, page]
  );

  const pagedVersions = React.useMemo(
    () => versionsState.reportVersions.slice(versionPage.skip, versionPage.skip + versionPage.take),
    [versionsState.reportVersions, versionPage]
  );

  React.useEffect(() => {
    setPage(prev => ({ ...prev, skip: 0 }));
  }, [query, reportsState.selectedCompanyId]);

  React.useEffect(() => {
    setVersionPage(prev => ({ ...prev, skip: 0 }));
  }, [versionsState.selectedReportId]);

  React.useEffect(() => {
    let cancelled = false;
    const companyId = reportsState.selectedCompanyId;

    if (companyId == null) {
      dispatch(reportsActions.clear());
      return;
    }

    const load = async () => {
      dispatch(reportsActions.setReportsLoading(true));
      dispatch(reportsActions.setStatisticsLoading(true));
      dispatch(reportsActions.setError(null));
      try {
        const [reports, statistics] = await Promise.all([
          fetchReportsByCompany(companyId),
          fetchCompanyKpis(companyId),
        ]);
        if (cancelled) return;
        dispatch(reportsActions.setReports(reports));
        dispatch(reportsActions.setStatistics(statistics));
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Failed to load reports';
        dispatch(reportsActions.setError(message));
        dispatch(reportsActions.setReports([]));
        dispatch(reportsActions.setStatistics([]));
      } finally {
        if (cancelled) return;
        dispatch(reportsActions.setReportsLoading(false));
        dispatch(reportsActions.setStatisticsLoading(false));
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [dispatch, reportsState.selectedCompanyId]);

  React.useEffect(() => {
    let cancelled = false;
    const reportId = versionsState.selectedReportId;

    if (reportId == null) {
      return;
    }

    const loadVersions = async () => {
      dispatch(reportVersionsActions.setLoading(true));
      dispatch(reportVersionsActions.setError(null));
      try {
        const versions = await fetchReportVersions(reportId);
        if (cancelled) return;
        dispatch(reportVersionsActions.setReportVersions(versions));
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Failed to load report versions';
        dispatch(reportVersionsActions.setError(message));
        dispatch(reportVersionsActions.setReportVersions([]));
      } finally {
        if (cancelled) return;
        dispatch(reportVersionsActions.setLoading(false));
      }
    };

    void loadVersions();
    return () => {
      cancelled = true;
    };
  }, [dispatch, versionsState.selectedReportId]);

  const handleCompanyChange = React.useCallback((company: Company | null) => {
    const companyId = company ? Number(company.id) : null;
    dispatch(reportsActions.setSelectedCompanyId(companyId));
    dispatch(reportVersionsActions.setSelectedReportId(null));
    setQuery('');
    setPage(initialPageState);
    setVersionPage(initialVersionPageState);
  }, [dispatch]);

  const handleReportSelect = React.useCallback((reportId: number | null) => {
    dispatch(reportVersionsActions.setSelectedReportId(reportId));
  }, [dispatch]);

  const handleVersionRowClick = React.useCallback(() => {
    navigate('/diagram');
  }, [navigate]);

  const handleReportPageChange = React.useCallback((event: PageChangeEvent) => {
    setPage({ skip: event.skip, take: event.take });
  }, []);

  const handleVersionPageChange = React.useCallback((event: PageChangeEvent) => {
    setVersionPage({ skip: event.skip, take: event.take });
  }, []);

  const toggleDialog = React.useCallback(() => {
    setModalVisible(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      {modalVisible && (
        <BaseModal
          title={"Please Confirm"}
          onClose={toggleDialog}
          body={
            <p className='text-center'>Are you sure you want to continue?</p>
          }
          actions={
            <>
              <BaseButton color='red' onClick={toggleDialog}>No</BaseButton>
              <BaseButton color='blue' onClick={toggleDialog}>Yes</BaseButton>
            </>
          }
        />
      )}

      <div className="p-5 px-25">
        <StatisticsCards
          statistics={reportsState.statistics}
          loading={reportsState.loadingStatistics}
        />

        <BaseCard className="mt-5" dividers={false}>
          <BaseCard.Header>
            <div className="flex items-center gap-2">
              <CompanySelector onCompanyChange={handleCompanyChange} />
            </div>
            <div className="flex items-center gap-2">
              <BaseButton color="gray" svgIcon={copyIcon} title="Copy" onClick={toggleDialog}>Copy</BaseButton>
              <BaseButton color="red" svgIcon={trashIcon} title="Delete" onClick={toggleDialog}>Delete</BaseButton>
            </div>
          </BaseCard.Header>

          <ReportList
            pageData={pagedReports}
            total={filteredReports.length}
            page={page}
            onPageChange={handleReportPageChange}
            query={query}
            onQueryChange={setQuery}
            selectedReportId={versionsState.selectedReportId}
            onSelectReport={handleReportSelect}
            disabled={reportListDisabled}
            loading={reportsState.loadingReports}
          />
        </BaseCard>

        {versionsState.selectedReportId != null && (
          <BaseCard className="mt-5" dividers={false}>
            <BaseCard.Header>
              <div className="flex items-center gap-2">
                <h3 className="font-bold">Version History</h3>
              </div>
              <div className="flex items-center gap-2">
                <BaseButton color="red" svgIcon={trashIcon} title="Delete" onClick={toggleDialog}>Delete</BaseButton>
              </div>
            </BaseCard.Header>

            <ReportVersion
              versions={versionsState.reportVersions}
              pageData={pagedVersions}
              total={versionsState.reportVersions.length}
              page={versionPage}
              onPageChange={handleVersionPageChange}
              onRowClick={handleVersionRowClick}
              loading={versionsState.loading}
            />
          </BaseCard>
        )}
      </div>
    </div>
  );
}
