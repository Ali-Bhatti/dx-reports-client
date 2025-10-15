import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';

interface SaveConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reportName?: string;
    isNewVersion: boolean;
    isLoading?: boolean;
}

function SaveConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    reportName,
    isNewVersion,
    isLoading = false
}: SaveConfirmationModalProps) {
    const modalContent = {
        title: isNewVersion ? 'Add New Version' : 'Save Report',
        message: isNewVersion
            ? <>Are you sure you want to create a new version for <strong>{reportName}</strong>?</>
            : <>Are you sure you want to save changes to <strong>{reportName}</strong>?</>,
        confirmText: isNewVersion ? 'Add Version' : 'Save'
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            onClose={onClose}
            title={modalContent.title}
            size="md"
            type="confirmation"
            autoHeight={true}
            body={
                <div className="text-gray-600">
                    <p>{modalContent.message}</p>
                    {isNewVersion && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">
                                This will create a new version based on the current report design.
                            </p>
                        </div>
                    )}
                </div>
            }
            actions={
                <div className="flex space-x-3">
                    <BaseButton
                        color="gray"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </BaseButton>
                    <BaseButton
                        color="blue"
                        onClick={onConfirm}
                        disabled={isLoading}
                        typeVariant={isLoading ? 'loader' : 'default'}
                    >
                        {modalContent.confirmText}
                    </BaseButton>
                </div>
            }
        />
    );
}

export default SaveConfirmationModal;