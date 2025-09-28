import type { ICellRendererParams } from 'ag-grid-community';

// Checkbox renderer for status/boolean fields
const CheckboxRenderer = ({ value }: ICellRendererParams<any, boolean>) => (
    <input
        type="checkbox"
        checked={!!value}
        readOnly
        className="cursor-default"
    />
);

export default CheckboxRenderer;