import type { IFilterParams, IDoesFilterPassParams } from 'ag-grid-community';

export class YesNoCheckboxFilter {
    params!: IFilterParams;
    values: Set<string> = new Set();
    gui!: HTMLDivElement;

    init(params: IFilterParams) {
        this.params = params;
        this.gui = document.createElement('div');
        this.gui.className = 'ag-filter-body';
        this.gui.style.padding = '8px';
        this.gui.innerHTML = `
      <div style="font-weight: 500; margin-bottom: 6px; font-size: 13px;">Filter by ${this.params.colDef.headerName}:</div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label class="ag-checkbox-label"><input type="checkbox" value="true" style="margin-right: 6px;" /> Yes</label>
        <label class="ag-checkbox-label"><input type="checkbox" value="false" style="margin-right: 6px;" /> No</label>
      </div>
    `;
        const checkboxes = this.gui.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((cb) => {
            cb.addEventListener('change', () => {
                this.values.clear();
                checkboxes.forEach((c) => {
                    if ((c as HTMLInputElement).checked) {
                        this.values.add((c as HTMLInputElement).value);
                    }
                });
                params.filterChangedCallback();
            });
        });
    }

    getGui() {
        return this.gui;
    }

    doesFilterPass(params: IDoesFilterPassParams) {
        if (this.values.size === 0) return true;
        const field = this.params.colDef.field;
        if (!field) return true;
        const value = String(params.data[field]);
        return this.values.has(value);
    }

    isFilterActive() {
        return this.values.size > 0;
    }

    getModel() {
        if (!this.isFilterActive()) return null;
        return { values: Array.from(this.values) };
    }

    setModel(model: any) {
        this.values.clear();
        if (model && model.values) {
            model.values.forEach((v: string) => this.values.add(v));
        }
        // update checkboxes
        const checkboxes = this.gui.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((cb) => {
            (cb as HTMLInputElement).checked = this.values.has((cb as HTMLInputElement).value);
        });
    }
}

export default YesNoCheckboxFilter;
