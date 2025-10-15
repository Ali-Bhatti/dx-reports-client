import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
}

export default function WarningModal({
    isOpen,
    onClose,
    title = 'Warning',
    message
}: WarningModalProps) {

    if (!isOpen) return null;

    return (
        <BaseModal
            title={title}
            onClose={onClose}
            size="md"
            type="warning"
            autoHeight={true}
            body={
                <p dangerouslySetInnerHTML={{ __html: message }} />
            }
            actions={
                <BaseButton
                    color="gray"
                    onClick={onClose}
                >
                    Okay
                </BaseButton>
            }
        />
    );
}
