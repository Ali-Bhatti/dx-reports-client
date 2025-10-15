import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';
import { VersionDisplay } from '../dashboard/VersionDisplay';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemNames: string[];
    itemType: 'report' | 'reports' | 'version';
    isLoading?: boolean;
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
    isLoading = false,
    versionInfo
}: DeleteModalProps) {

    if (!isOpen) return null;

    const renderMessage = () => {
        const isVersion = itemType === 'version';
        if (isVersion && versionInfo) {
            return (
                <p>
                    Are you sure you want to delete the <VersionDisplay version={versionInfo.version} isBold={true} /> of report <strong>{versionInfo.reportName}</strong>?
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
                            <li key={`${name}_${index}`}>{isVersion ? <VersionDisplay version={name} /> : name}</li>
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
                    <BaseButton
                        color="gray"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </BaseButton>
                    <BaseButton
                        color="red"
                        onClick={onConfirm}
                        disabled={isLoading}
                        typeVariant={isLoading ? 'loader' : 'default'}
                    >
                        Delete
                    </BaseButton>
                </>
            }
        />
    );
}