// BaseTable.tsx
import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type {
    ColDef,
    GridOptions,
    ILoadingOverlayParams,
} from 'ag-grid-community';
import type { AgGridReactProps } from 'ag-grid-react';
import BaseLoader from './BaseLoader';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const CustomLoadingOverlay = (_props: ILoadingOverlayParams) => {
    return (
        <div style={{
            backgroundColor: 'white',
            zIndex: 999
        }}>
            <BaseLoader type="pulsing" themeColor="primary" loadingText="Loading..." loadingTextSize='text-lg' />
        </div>
    );
};

export interface BaseTableProps<TData = any> extends Omit<AgGridReactProps<TData>, 'columnDefs' | 'defaultColDef' | 'gridOptions'> {
    columnDefs?: ColDef<TData>[];
    defaultColDef?: ColDef<TData>;
    gridOptions?: GridOptions<TData>;
    height?: number | string;
    className?: string;
    showCheckboxColumn?: boolean;
    pagination?: boolean;
    paginationPageSize?: number;
}

const BaseTable = <TData extends any = any>({
    columnDefs = [],
    defaultColDef = {},
    gridOptions = {},
    height = 420,
    className = '',
    showCheckboxColumn = true,
    pagination = true,
    paginationPageSize = 20,
    ...props
}: BaseTableProps<TData>) => {

    // Default column definition
    const mergedDefaultColDef = useMemo<ColDef<TData>>(() => ({
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 120,
        filter: true,
        ...defaultColDef,
    }), [defaultColDef]);

    // Use columnDefs directly, let AG Grid handle checkboxSelection
    const mergedColumnDefs = useMemo<ColDef<TData>[]>(() => columnDefs, [columnDefs]);

    // Default grid options
    const mergedGridOptions = useMemo<GridOptions<TData>>(() => ({
        rowHeight: 40,
        headerHeight: 40,
        theme: "legacy",
        rowSelection: {
            mode: "multiRow",
            checkboxes: showCheckboxColumn,
            headerCheckbox: showCheckboxColumn,
            enableClickSelection: true,
        },
        loadingOverlayComponent: CustomLoadingOverlay,
        ...gridOptions,
    }), [gridOptions, showCheckboxColumn]);

    return (
        <div className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white ${className}`}>
            <div
                className="ag-theme-quartz"
                style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
            >
                <AgGridReact<TData>
                    columnDefs={mergedColumnDefs}
                    defaultColDef={mergedDefaultColDef}
                    suppressHorizontalScroll={false}
                    suppressColumnVirtualisation={false}
                    animateRows={true}
                    gridOptions={mergedGridOptions}
                    suppressCellFocus={true}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    {...props}
                />
            </div>
        </div>
    );
};

export default BaseTable;