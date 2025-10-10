import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';
import { VersionDisplay } from '../dashboard/VersionDisplay';

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    version: string | number;
    reportName: string;
    isLoading?: boolean;
    currentPublishedVersion?: string | number;
    isResetPublished?: boolean;
}

export default function PublishModal({
    isOpen,
    onClose,
    onConfirm,
    version,
    reportName,
    isLoading = false,
    currentPublishedVersion,
    isResetPublished = false
}: PublishModalProps) {

    if (!isOpen) return null;

    const confirmationMessage = !isResetPublished ? (
        <p>
            Are you sure you want to publish the <VersionDisplay version={version} isBold={true} /> of report <strong>{reportName}</strong>?
            {currentPublishedVersion && currentPublishedVersion !== version && (
                <> <br /> This will replace the currently published version <VersionDisplay version={currentPublishedVersion} isBold={true} />.</>
            )}
        </p>
    ) : (
        <p>
            Are you sure you want to unpublish <VersionDisplay version={version} isBold={true} /> of report <strong>{reportName}</strong>?
        </p>
    );
    ;
    return (
        <BaseModal
            title="Confirm Publish"
            onClose={onClose}
            size="md"
            type="confirmation"
            autoHeight={true}
            body={
                confirmationMessage
            }
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
                        color="blue"
                        onClick={onConfirm}
                        disabled={isLoading}
                        typeVariant={isLoading ? 'loader' : 'default'}
                    >
                        {isResetPublished ? 'Unpublish' : 'Publish'}
                    </BaseButton>
                </>
            }
        />
    );
}