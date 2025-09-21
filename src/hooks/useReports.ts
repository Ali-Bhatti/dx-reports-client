import { useState, useEffect, useCallback } from 'react';
import type { Report, ReportStatistics } from '../types';
import apiService from '../services/report';

export const useReports = (companyId?: string) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statistics, setStatistics] = useState<ReportStatistics | null>(null);
    const [selectedReports, setSelectedReports] = useState<string[]>([]);

    const fetchReports = useCallback(async (search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getReports(companyId, search);
            setReports(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    }, [companyId]);

    const fetchStatistics = useCallback(async () => {
        try {
            const stats = await apiService.getReportStatistics(companyId);
            setStatistics(stats);
        } catch (err) {
            console.error('Failed to fetch statistics:', err);
        }
    }, [companyId]);

    const createReport = useCallback(async (reportData: Partial<Report>) => {
        try {
            const newReport = await apiService.createReport(reportData);
            setReports(prev => [...prev, newReport]);
            return newReport;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create report');
            throw err;
        }
    }, []);

    const updateReport = useCallback(async (id: string, reportData: Partial<Report>) => {
        try {
            const updatedReport = await apiService.updateReport(id, reportData);
            setReports(prev => prev.map(report =>
                report.id === id ? updatedReport : report
            ));
            return updatedReport;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update report');
            throw err;
        }
    }, []);

    const deleteReport = useCallback(async (id: string) => {
        try {
            await apiService.deleteReport(id);
            setReports(prev => prev.filter(report => report.id !== id));
            setSelectedReports(prev => prev.filter(reportId => reportId !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete report');
            throw err;
        }
    }, []);

    const copyReport = useCallback(async (id: string) => {
        try {
            const copiedReport = await apiService.copyReport(id);
            setReports(prev => [...prev, copiedReport]);
            return copiedReport;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to copy report');
            throw err;
        }
    }, []);

    const toggleReportSelection = useCallback((reportId: string) => {
        setSelectedReports(prev =>
            prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    }, []);

    const selectAllReports = useCallback(() => {
        setSelectedReports(reports.map(report => report.id));
    }, [reports]);

    const clearSelection = useCallback(() => {
        setSelectedReports([]);
    }, []);

    useEffect(() => {
        fetchReports();
        fetchStatistics();
    }, [fetchReports, fetchStatistics]);

    return {
        reports,
        loading,
        error,
        statistics,
        selectedReports,
        fetchReports,
        createReport,
        updateReport,
        deleteReport,
        copyReport,
        toggleReportSelection,
        selectAllReports,
        clearSelection,
    };
};
