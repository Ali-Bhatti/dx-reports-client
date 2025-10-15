import { useState, useEffect, useMemo } from 'react';
import { AutoComplete, type AutoCompleteChangeEvent } from '@progress/kendo-react-dropdowns';
import { useCompanies } from '../../hooks/useCompanies';
import type { Company } from '../../types';

type Props = {
  onCompanyChange?: (company: Company | null) => void;
  disabled?: boolean;
  className?: string;
  restoreSavedCompany?: boolean;
  excludeCompanyIds?: number[];
};

export const CompanySelector = ({
  onCompanyChange,
  disabled = false,
  className = '',
  restoreSavedCompany = false,
  excludeCompanyIds = []
}: Props) => {
  const { companies, loading, error } = useCompanies();
  const [selected, setSelected] = useState<Company | null>(null);
  const [value, setValue] = useState<string>('');

  const filteredCompanies = useMemo(() => {
    let filtered = companies;

    if (excludeCompanyIds.length > 0) {
      filtered = filtered.filter(company => !excludeCompanyIds.includes(company.id));
    }

    if (value && value !== selected?.name) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    return filtered;
  }, [companies, value, selected, excludeCompanyIds]);

  const handleChange = (e: AutoCompleteChangeEvent) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue === '') {
      setSelected(null);
      onCompanyChange?.(null);
      return;
    }

    const selectedCompany = companies.find(company =>
      company.name === inputValue
    );

    if (selectedCompany) {
      setSelected(selectedCompany);
      onCompanyChange?.(selectedCompany);
    }
  };


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
          data={filteredCompanies}
          textField="name"
          dataItemKey="id"
          value={value}
          onChange={handleChange}
          placeholder={loading ? 'Loading companies...' : 'Search or select company'}
          disabled={disabled || loading}
          className="k-rounded-lg !h-10 flex-1 custom-autocomplete"
          suggest={false}
          clearButton={false}
          fillMode="outline"
        />
      </div>

      {error && (
        <div className='mt-1 text-sm text-fg-red'>
          <span>Failed to load companies</span>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;