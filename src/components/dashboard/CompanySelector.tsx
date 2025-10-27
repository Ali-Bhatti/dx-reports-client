import { useState, useEffect, useMemo } from 'react';
import { AutoComplete, type AutoCompleteChangeEvent } from '@progress/kendo-react-dropdowns';
import { useCompanies } from '../../hooks/useCompanies';
import type { Company, Environment } from '../../types';

type Props = {
  onCompanyChange?: (company: Company | null) => void;
  disabled?: boolean;
  className?: string;
  restoreSavedCompany?: boolean;
  excludeCompanyIds?: number[];
  showEnvironmentMessage?: boolean;
  currentEnvironment?: Environment | null;
  allowClear?: boolean;
  useCopyModalEnvironment?: boolean;
};

export const CompanySelector = ({
  onCompanyChange,
  disabled = false,
  className = '',
  restoreSavedCompany = false,
  excludeCompanyIds = [],
  showEnvironmentMessage = false,
  currentEnvironment = null,
  allowClear = false,
  useCopyModalEnvironment = false
}: Props) => {
  const { companies, loading, error, fetching } = useCompanies({
    environment: currentEnvironment,
    useCopyModalEnvironment
  });
  const [selected, setSelected] = useState<Company | null>(null);
  const [value, setValue] = useState<string>('');

  const filteredCompanies = useMemo(() => {
    if (error) return [];
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
    setSelected(null);
    setValue('');
  }, [currentEnvironment?.id]);

  useEffect(() => {
    if (restoreSavedCompany && !loading && !error && companies.length > 0) {
      const savedCompanyId = localStorage.getItem('selectedCompanyId');
      if (savedCompanyId) {
        const foundCompany = companies.find(c => String(c.id) === savedCompanyId);
        if (foundCompany) {
          setSelected(foundCompany);
          setValue(foundCompany.name);
          onCompanyChange?.(foundCompany);
        }
      }
    }
  }, [companies, loading, error]);


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
          placeholder={
            disabled && !loading
              ? 'Select environment first'
              : loading || fetching
                ? 'Loading companies...'
                : 'Search or select company'
          }
          disabled={disabled || loading || fetching}
          className="k-rounded-lg !h-10 flex-1 custom-autocomplete"
          suggest={false}
          clearButton={allowClear}
          fillMode="outline"
        />
      </div>

      {showEnvironmentMessage && (
        <div className='mt-1 text-sm text-yellow-600'>
          <span>Select environment to fetch companies</span>
        </div>
      )}

      {error && (
        <div className='mt-1 text-sm text-fg-red'>
          <span>Failed to load companies</span>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;