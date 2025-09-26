import { useState } from 'react';
import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';
import CompanySelector from '../dashboard/CompanySelector';
import type { Company } from '../../types';

interface CopyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (destinationCompany: Company) => void;
    reportNames?: string[];
    isMultiple?: boolean;
}

export default function CopyModal({
    isOpen,
    onClose,
    onConfirm,
    reportNames = [],
    isMultiple = false
}: CopyModalProps) {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    const handleCompanyChange = (company: Company | null) => {
        setSelectedCompany(company);
    };

    const handleConfirm = () => {
        if (selectedCompany) {
            onConfirm(selectedCompany);
            onClose();
            setSelectedCompany(null);
        }
    };

    const handleClose = () => {
        onClose();
        setSelectedCompany(null);
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            title="Select Destination Company"
            onClose={handleClose}
            size="md"
            body={
                <div className="space-y-4">
                    <CompanySelector
                        onCompanyChange={handleCompanyChange}
                    />
                    <p className="text-sm text-gray-600">
                        Note: Copy operation will copy the latest version of the report{isMultiple ? 's' : ''} to destination company
                    </p>
                    {isMultiple && reportNames.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Selected Reports:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {reportNames.map((name, index) => (
                                    <li key={`${name}_${index}`}>{name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            }
            actions={
                <>
                    <BaseButton color="gray" onClick={handleClose}>
                        Cancel
                    </BaseButton>
                    <BaseButton
                        color="blue"
                        onClick={handleConfirm}
                        disabled={!selectedCompany}
                    >
                        Copy
                    </BaseButton>
                </>
            }
        />
    );
}