import { useState, useEffect, useMemo } from 'react';
import { AutoComplete, type AutoCompleteChangeEvent } from '@progress/kendo-react-dropdowns';
import { environments } from '../../config/config';
import type { Environment } from '../../types';

type Props = {
  onEnvironmentChange?: (environment: Environment | null) => void;
  disabled?: boolean;
  className?: string;
  restoreSavedEnvironment?: boolean;
};

export const EnvironmentSelector = ({
  onEnvironmentChange,
  disabled = false,
  className = '',
  restoreSavedEnvironment = false
}: Props) => {
  const [selected, setSelected] = useState<Environment | null>(null);
  const [value, setValue] = useState<string>('');

  const filteredEnvironments = useMemo(() => {
    let filtered = environments;

    if (value && value !== selected?.name) {
      filtered = filtered.filter(environment =>
        environment.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    return filtered;
  }, [value, selected]);

  const handleChange = (e: AutoCompleteChangeEvent) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue === '') {
      setSelected(null);
      onEnvironmentChange?.(null);
      return;
    }

    const selectedEnvironment = environments.find(environment =>
      environment.name === inputValue
    );

    if (selectedEnvironment) {
      setSelected(selectedEnvironment);
      onEnvironmentChange?.(selectedEnvironment);
    }
  };

  useEffect(() => {
    if (restoreSavedEnvironment && environments.length > 0) {
      if (!selected) {
        const savedEnvironmentJson = localStorage.getItem('selectedEnvironment');
        if (savedEnvironmentJson) {
          try {
            const savedEnvironment = JSON.parse(savedEnvironmentJson) as Environment;
            const foundEnvironment = environments.find(e => e.id === savedEnvironment.id);
            if (foundEnvironment) {
              setSelected(foundEnvironment);
              setValue(foundEnvironment.name);
              onEnvironmentChange?.(foundEnvironment);
            }
          } catch (error) {
            console.error('Failed to parse saved environment:', error);
            localStorage.removeItem('selectedEnvironment');
          }
        }
      } else {
        setValue(selected.name);
      }
    }
  }, [selected, onEnvironmentChange, restoreSavedEnvironment]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <AutoComplete
          data={filteredEnvironments}
          textField="name"
          dataItemKey="id"
          value={value}
          onChange={handleChange}
          placeholder="Select Environment"
          disabled={disabled}
          className="k-rounded-lg !h-10 flex-1 custom-autocomplete"
          suggest={false}
          clearButton={false}
          fillMode="outline"
        />
      </div>
    </div>
  );
};

export default EnvironmentSelector;
