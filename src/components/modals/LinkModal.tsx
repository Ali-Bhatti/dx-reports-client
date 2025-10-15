import { useState, useEffect, useMemo } from 'react';
import BaseModal from '../shared/BaseModal';
import BaseButton from '../shared/BaseButton';
import BaseLoader from '../shared/BaseLoader';
import type { LinkedPage } from '../../types';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedPageIds: number[]) => void;
    reportName: string;
    pages: LinkedPage[];
    isLoading?: boolean;
    isSaving?: boolean;
}

export default function LinkModal({
    isOpen,
    onClose,
    onConfirm,
    reportName,
    pages,
    isLoading = false,
    isSaving = false
}: LinkModalProps) {
    const [selectedPageIds, setSelectedPageIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // Initialize selected pages with already linked pages
    useEffect(() => {
        if (isOpen && pages.length > 0) {
            const linkedPageIds = pages.filter(p => p.isLinked).map(p => p.pageId);
            setSelectedPageIds(linkedPageIds);
            setSelectAll(linkedPageIds.length === pages.length);
        }
    }, [isOpen, pages]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedPageIds([]);
            setSelectAll(false);
        }
    }, [isOpen]);

    const handlePageToggle = (pageId: number) => {
        setSelectedPageIds(prev => {
            const newPageIds = prev.includes(pageId)
                ? prev.filter(id => id !== pageId)
                : [...prev, pageId];

            // Update selectAll state based on selection
            setSelectAll(newPageIds.length === pages.length);
            return newPageIds;
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedPageIds([]);
            setSelectAll(false);
        } else {
            setSelectedPageIds(pages.map(p => p.pageId));
            setSelectAll(true);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedPageIds);
    };

    const handleClose = () => {
        onClose();
    };

    const initialLinkedPageIds = useMemo(() => {
        return pages.filter(p => p.isLinked).map(p => p.pageId);
    }, [pages]);

    const buttonText = useMemo(() => {
        if (selectedPageIds.length === 0 && initialLinkedPageIds.length > 0) {
            return "Unlink";
        }
        return "Link";
    }, [selectedPageIds.length, initialLinkedPageIds.length]);

    const hasSelectionChanged = useMemo(() => {
        if (selectedPageIds.length !== initialLinkedPageIds.length) {
            return true;
        }
        // Check if all selected pages match the initial linked pages
        const sortedSelected = [...selectedPageIds].sort();
        const sortedInitial = [...initialLinkedPageIds].sort();
        return !sortedSelected.every((id, index) => id === sortedInitial[index]);
    }, [selectedPageIds, initialLinkedPageIds]);

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
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <BaseLoader
                                    type="pulsing"
                                    size="medium"
                                    themeColor="primary"
                                    loadingText="Loading pages..."
                                    loadingTextSize="text-base"
                                />
                            </div>
                        ) : (
                            <>
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

                                {pages.map((page) => (
                                    <label key={page.pageId} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedPageIds.includes(page.pageId)}
                                            onChange={() => handlePageToggle(page.pageId)}
                                            className="rounded border-gray-300"
                                        />
                                        <span>{page.name}</span>
                                    </label>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            }
            actions={
                <>
                    <BaseButton
                        color="gray"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </BaseButton>
                    <BaseButton
                        color="blue"
                        onClick={handleConfirm}
                        disabled={isLoading || isSaving || !hasSelectionChanged}
                        typeVariant={isSaving ? 'loader' : 'default'}
                    >
                        {buttonText}
                    </BaseButton>
                </>
            }
        />
    );
}