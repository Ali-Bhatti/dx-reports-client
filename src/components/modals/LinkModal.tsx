// components/modals/LinkModal.tsx
import * as React from 'react';
import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedPages: string[]) => void;
    reportName: string;
}

const availablePages = [
    'Orders',
    'Groupage Incoming',
    'Groupage Outgoing',
    'Haulier invoice calculation',
    'Batch invoices',
    'GroupageOrderPlanningTimeLinePage',
];

export default function LinkModal({
    isOpen,
    onClose,
    onConfirm,
    reportName
}: LinkModalProps) {
    const [selectedPages, setSelectedPages] = React.useState<string[]>([]);
    const [selectAll, setSelectAll] = React.useState(false);

    const handlePageToggle = (page: string) => {
        setSelectedPages(prev => {
            const newPages = prev.includes(page)
                ? prev.filter(p => p !== page)
                : [...prev, page];

            // Update selectAll state based on selection
            setSelectAll(newPages.length === availablePages.length);
            return newPages;
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedPages([]);
            setSelectAll(false);
        } else {
            setSelectedPages([...availablePages]);
            setSelectAll(true);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedPages);
        onClose();
        setSelectedPages([]);
        setSelectAll(false);
    };

    const handleClose = () => {
        onClose();
        setSelectedPages([]);
        setSelectAll(false);
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            title="Link Report to Web Page"
            onClose={handleClose}
            size="md"
            body={
                <div className="space-y-4">
                    <div>
                        <strong>Report Name:</strong> {reportName}
                    </div>

                    <div className="border border-gray-300 rounded p-3 space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer font-medium">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="rounded border-gray-300"
                            />
                            <span>Select All</span>
                        </label>

                        <hr className="border-gray-200" />

                        {availablePages.map((page, index) => (
                            <label key={index} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedPages.includes(page)}
                                    onChange={() => handlePageToggle(page)}
                                    className="rounded border-gray-300"
                                />
                                <span>{page}</span>
                            </label>
                        ))}
                    </div>
                </div>
            }
            actions={
                <>
                    <BaseButton color="gray" onClick={handleClose}>
                        Cancel
                    </BaseButton>
                    <BaseButton color="blue" onClick={handleConfirm}>
                        Link
                    </BaseButton>
                </>
            }
        />
    );
}