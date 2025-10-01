import type { ICellRendererParams } from 'ag-grid-community';

// Function to show YES or NO for boolean values
const YesNoRenderer = ({ value }: ICellRendererParams<any, boolean>) => (
    <span>{value ? 'Yes' : 'No'}</span>
);

export default YesNoRenderer;
