import React, { useState, useEffect } from 'react';
import type { Company } from '../../types';

// Placeholder API service until real implementation is wired up
const apiService = {
  getCompanies: async () => ({ data: [] as Company[] }),
};

interface CompanySelectorProps {
  selectedCompanyId?: string;
  onCompanyChange: (companyId: string) => void;
  disabled?: boolean;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  selectedCompanyId,
  onCompanyChange,
  disabled = false
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getCompanies();
        setCompanies(response.data);
        
        // Auto-select first company if none selected
        if (!selectedCompanyId && response.data.length > 0) {
          onCompanyChange(response.data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [selectedCompanyId, onCompanyChange]);

  const selectedCompany = companies.find(company => company.id === selectedCompanyId);

  if (loading) {
    return (
      <div className="relative">
        <select
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
        >
          <option>Loading companies...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <select
          disabled
          className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50 text-red-600"
        >
          <option>Error loading companies</option>
        </select>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={selectedCompanyId || ''}
        onChange={(e) => onCompanyChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      
      {/* Company Status Indicator */}
      {selectedCompany && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className={`w-2 h-2 rounded-full ${
            selectedCompany.status === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </div>
      )}
    </div>
  );
};
