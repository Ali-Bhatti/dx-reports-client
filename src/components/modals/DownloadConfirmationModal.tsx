import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';

interface DownloadConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reportName?: string;
}

function DownloadConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    reportName
}: DownloadConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <BaseModal
            onClose={onClose}
            title="Download Report"
            size="md"
            type="confirmation"
            autoHeight={true}
            body={
                <div className="text-gray-600">
                    <p>Are you sure you want to download "{reportName}"?</p>
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">
                            The report will be downloaded as a PDF file.
                        </p>
                    </div>
                </div>
            }
            actions={
                <div className="flex space-x-3">
                    <BaseButton
                        color="gray"
                        onClick={onClose}
                    >
                        Cancel
                    </BaseButton>
                    <BaseButton
                        color="blue"
                        onClick={onConfirm}
                    >
                        Download
                    </BaseButton>
                </div>
            }
        />
    );
}

export default DownloadConfirmationModal;