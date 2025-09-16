import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'


import type { Report, ReportStatistics, Company } from "../../types";

let reportsInitialState: Report[] = [];
let reportStatisticsInitialState: ReportStatistics[] = [];
let companyInitialState: Company = { id: 0, name: "" };

const reportsSlice = createSlice({
    name: "reports",
    initialState: {
        reports: reportsInitialState,
        reportStatistics: reportStatisticsInitialState,
        selectedCompany: companyInitialState
    },
    reducers: {
        setCompany(state, action: PayloadAction<Company>) {
            state.selectedCompany = action.payload;
        },
        setReports(state, action: PayloadAction<Report[]>) {
            // here will be an API call to fetch reports for the selected company
            state.reports = action.payload;
        },
        setReportStatistics(state, action: PayloadAction<ReportStatistics[]>) {
            // here will be an API call to fetch report statistics for the selected company
            state.reportStatistics = action.payload;
        }
    }
});

export const { setReports, setCompany, setReportStatistics } = reportsSlice.actions;
export default reportsSlice.reducer;