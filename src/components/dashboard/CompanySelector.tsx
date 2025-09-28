import { useState, useEffect } from 'react';
import { AutoComplete, type AutoCompleteChangeEvent } from '@progress/kendo-react-dropdowns';
import { useCompanies } from '../../hooks/useCompanies';
import type { Company } from '../../types';

type Props = {
  onCompanyChange?: (company: Company | null) => void;
  disabled?: boolean;
  className?: string;
  restoreSavedCompany?: boolean;
};

export const CompanySelector = ({
  onCompanyChange,
  disabled = false,
  className = '',
  restoreSavedCompany = false
}: Props) => {
  const { companies, loading, error } = useCompanies();
  const [selected, setSelected] = useState<Company | null>(null);
  const [value, setValue] = useState<string>('');

  // Handle AutoComplete change
  const handleChange = (e: AutoCompleteChangeEvent) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    // Find the company that matches the input value
    const selectedCompany = companies.find(company =>
      company.name === inputValue
    ) || null;

    setSelected(selectedCompany);
    onCompanyChange?.(selectedCompany);
  };

  // Filter companies based on user input
  // const filteredCompanies = companies.filter(company =>
  //   company.name.toLowerCase().includes(value.toLowerCase())
  // );

  useEffect(() => {
    if (restoreSavedCompany && !loading && !error && companies.length > 0) {
      // Restore selected company from localStorage if not already selected
      if (!selected) {
        const savedCompanyId = localStorage.getItem('selectedCompanyId');
        if (savedCompanyId) {
          const foundCompany = companies.find(c => String(c.id) === savedCompanyId);
          if (foundCompany) {
            setSelected(foundCompany);
            setValue(foundCompany.name);
            onCompanyChange?.(foundCompany);
          }
        }
      } else {
        setValue(selected.name);
      }
    }
  }, [companies, loading, error, selected, onCompanyChange]);

  return (
    <div className={className}>
      {/* Company AutoComplete */}
      <div className="flex items-center gap-2">
        <AutoComplete
          data={companies}
          textField="name"
          dataItemKey="id"
          value={value}
          onChange={handleChange}
          placeholder={loading ? 'Loading companies...' : 'Search or select company'}
          disabled={disabled || loading}
          className="k-rounded-lg !h-10 flex-1 custom-autocomplete"
          suggest={true}
          clearButton={false}
          fillMode="outline"
        />
      </div>

      {error && (
        <div className='mt-1 text-sm text-red-600'>
          <span>Failed to load companies: {error}</span>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;