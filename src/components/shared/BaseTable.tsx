// BaseTable.tsx
import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type {
    ColDef,
    GridOptions,
} from 'ag-grid-community';
import type { AgGridReactProps } from 'ag-grid-react';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export interface BaseTableProps<TData = any> extends Omit<AgGridReactProps<TData>, 'columnDefs' | 'defaultColDef' | 'gridOptions'> {
    columnDefs?: ColDef<TData>[];
    defaultColDef?: ColDef<TData>;
    gridOptions?: GridOptions<TData>;
    height?: number | string;
    className?: string;
    showCheckboxColumn?: boolean;
}

const BaseTable = <TData extends any = any>({
    columnDefs = [],
    defaultColDef = {},
    gridOptions = {},
    height = 420,
    className = '',
    showCheckboxColumn = true,
    ...props
}: BaseTableProps<TData>) => {
    // Default checkbox column configuration
    const defaultCheckboxColumn: ColDef<TData> = useMemo(() => ({
        headerName: '',
        width: 20,
        minWidth: 20,
        maxWidth: 35,
        flex: 0,
        sortable: false,
        resizable: false,
    }), []);

    // Default column definition
    const mergedDefaultColDef = useMemo<ColDef<TData>>(() => ({
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 120,
        ...defaultColDef,
    }), [defaultColDef]);

    // Merge column definitions with checkbox column if enabled
    const mergedColumnDefs = useMemo<ColDef<TData>[]>(() => {
        return [defaultCheckboxColumn, ...columnDefs];
    }, [columnDefs, defaultCheckboxColumn, showCheckboxColumn]);

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
                    {...props}
                />
            </div>
        </div>
    );
};

export default BaseTable;