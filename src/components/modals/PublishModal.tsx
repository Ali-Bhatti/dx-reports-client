// components/modals/PublishModal.tsx
import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    version: string;
    reportName: string;
}

export default function PublishModal({
    isOpen,
    onClose,
    onConfirm,
    version,
    reportName
}: PublishModalProps) {

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            title="Confirm Publish"
            onClose={onClose}
            size="md"
            type="confirmation"
            autoHeight={true}
            body={
                <p>
                    Are you sure you want to publish the <strong>{version}</strong> of report <strong>{reportName}</strong>?
                </p>
            }
            actions={
                <>
                    <BaseButton color="gray" onClick={onClose}>
                        Cancel
                    </BaseButton>
                    <BaseButton color="blue" onClick={handleConfirm}>
                        Publish
                    </BaseButton>
                </>
            }
        />
    );
}