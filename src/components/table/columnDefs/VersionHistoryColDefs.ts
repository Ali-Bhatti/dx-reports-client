import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { VersionNameRenderer } from '../renderers';
import YesNoCheckboxFilter from '../filters/YesNoCheckboxFilter';
import { formatDateTime } from '../../../utils/dateFormatters';
import type { ReportVersion as HistoryRow } from '../../../types';
import { type JSX } from 'react';

interface VersionHistoryColDefsConfig {
    createVersionActionsRenderer: (props: ICellRendererParams<HistoryRow>) => JSX.Element;
    createPublishedToggleRenderer: (props: ICellRendererParams<HistoryRow>) => JSX.Element;
}
const isMobile = () => window.innerWidth < 640; 

export const getVersionHistoryColumnDefs = ({
    createVersionActionsRenderer,
    createPublishedToggleRenderer
}: VersionHistoryColDefsConfig): ColDef<HistoryRow>[] => [
        {
            headerName: 'Version',
            field: 'version',
            width: 120,
            minWidth: 100,
            maxWidth: 140,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            pinned: isMobile() ? null : 'left',
            cellRenderer: VersionNameRenderer,
        },
        {
            headerName: 'Creation Date',
            field: 'creationDate',
            flex: 1,
            minWidth: 140,
            valueFormatter: (p) => formatDateTime(p.value, "--")
        },
        {
            headerName: 'Modified On',
            field: 'modificationDate',
            flex: 1,
            minWidth: 140,
            valueFormatter: (p) => formatDateTime(p.value, "--")
        },
        {
            headerName: 'Modified By',
            field: 'editorId',
            type: 'text',
            flex: 1,
            minWidth: 120,
            valueFormatter: (p) => p.value || "--"
        },
        {
            headerName: 'Published',
            field: 'isPublished',
            flex: 1,
            width: 120,
            minWidth: 100,
            maxWidth: 140,
            cellRenderer: createPublishedToggleRenderer,
            sortable: false,
            filter: YesNoCheckboxFilter,
        },
        {
            headerName: 'Actions',
            flex: 0,
            width: 200,
            minWidth: 180,
            maxWidth: 250,
            cellRenderer: createVersionActionsRenderer,
            sortable: false,
            filter: false,
            pinned: isMobile() ? null : 'right',
        }
    ];