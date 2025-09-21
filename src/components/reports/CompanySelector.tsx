import * as React from 'react';
import { DropDownList, type DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import type { Company } from '../../types';

type Props = {
  onCompanyChange?: (company: Company | null) => void;
  disabled?: boolean;
  className?: string;
};

export const CompanySelector = ({
  onCompanyChange,
  disabled = false,
  className = ''
}: Props) => {
  // Local companies list (inside the component, as requested)
  const companies = React.useMemo<Company[]>(
    () => [
      { id: 1, name: 'Eurotacs', status: 'active' },
      { id: 2, name: 'Acme',     status: 'active' }
    ],
    []
  );

  const [selected, setSelected] = React.useState<Company | null>(null);

  // Kendo change handler
  const handleChange = (e: DropDownListChangeEvent) => {
    const value = (e.value as Company) ?? null;
    setSelected(value);
    onCompanyChange?.(value);
  };

  return (
    <div className={className}>
      <DropDownList
        data={companies}
        textField="name"
        dataItemKey="id"
        value={selected}
        onChange={handleChange}
        defaultItem={{ id: 0, name: 'Select company', status: '' } as Company}
        disabled={disabled}
        className="k-rounded-lg !h-10 !w-50"
      />
    </div>
  );
};

export default CompanySelector;
