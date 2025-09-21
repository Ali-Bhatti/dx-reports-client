// components/modals/DeleteModal.tsx
import * as React from 'react';
import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemNames: string[];
    itemType: 'report' | 'reports' | 'version';
    versionInfo?: {
        version: string;
        reportName: string;
    };
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemNames,
    itemType,
    versionInfo
}: DeleteModalProps) {

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    if (!isOpen) return null;

    const renderMessage = () => {
        if (itemType === 'version' && versionInfo) {
            return (
                <p>
                    Are you sure you want to delete the <strong>{versionInfo.version}</strong> of report <strong>{versionInfo.reportName}</strong>?
                </p>
            );
        }

        if (itemNames.length === 1) {
            return (
                <p>
                    Are you sure you want to delete the {itemType} <strong>{itemNames[0]}</strong>?
                </p>
            );
        }

        return (
            <div>
                <p className="mb-2">Are you sure you want to delete these {itemType}:</p>
                <div
                    className="max-h-48 overflow-y-auto"
                // style={{
                //     scrollbarWidth: 'thin', // For Firefox
                //     scrollbarColor: '#CBD5E0 #F7FAFC' // For Firefox
                // }}
                >
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {itemNames.map((name, index) => (
                            <li key={`${name}_${index}`}>{name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <BaseModal
            title="Confirm Delete"
            onClose={onClose}
            size="md"
            type="danger"
            body={renderMessage()}
            autoHeight={true}
            customMinHeight={150}
            customMaxHeight={400}
            actions={
                <>
                    <BaseButton color="gray" onClick={onClose}>
                        Cancel
                    </BaseButton>
                    <BaseButton color="red" onClick={handleConfirm}>
                        Delete
                    </BaseButton>
                </>
            }
        />
    );
}