import { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Checkbox } from '@progress/kendo-react-inputs';
import { SvgIcon } from '@progress/kendo-react-common';
import { searchIcon, xIcon } from '@progress/kendo-svg-icons';
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
    const [searchQuery, setSearchQuery] = useState('');

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
            setSearchQuery('');
        }
    }, [isOpen]);

    const filteredPages = useMemo(() => {
        if (!searchQuery.trim()) {
            return pages;
        }
        return pages.filter(page =>
            page.pageTitle?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [pages, searchQuery]);

    const selectedPageIdsSet = useMemo(() => {
        return new Set(selectedPageIds);
    }, [selectedPageIds]);

    const isAllFilteredSelected = useMemo(() => {
        if (filteredPages.length === 0) return false;
        return filteredPages.every(page => selectedPageIdsSet.has(page.pageId));
    }, [filteredPages, selectedPageIdsSet]);

    useEffect(() => {
        setSelectAll(isAllFilteredSelected);
    }, [isAllFilteredSelected]);

    const handlePageToggle = (pageId: number) => {
        setSelectedPageIds(prev => {
            const newPageIds = prev.includes(pageId)
                ? prev.filter(id => id !== pageId)
                : [...prev, pageId];
            return newPageIds;
        });
    };

    const handleSelectAll = useCallback(() => {
        if (selectAll) {
            // Deselect all filtered pages using Set for O(1) lookups
            const filteredPageIdsSet = new Set(filteredPages.map(p => p.pageId));
            setSelectedPageIds(prev => prev.filter(id => !filteredPageIdsSet.has(id)));
        } else {
            // Select all filtered pages (merge with existing selections) using Set
            setSelectedPageIds(prev => {
                const newSet = new Set(prev);
                filteredPages.forEach(page => newSet.add(page.pageId));
                return Array.from(newSet);
            });
        }
    }, [selectAll, filteredPages]);

    const handleSearchChange = (e: { value?: string }) => {
        setSearchQuery(e.value || '');
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
            autoHeight={true}
            body={
                <div className="space-y-4">
                    <div>
                        <strong>Report Name:</strong> {reportName}
                    </div>

                    <div className="border border-gray-300 rounded overflow-hidden">
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
                                {/* Select All Section */}
                                <div className="bg-gray-50 border-b border-gray-300 px-4 py-3">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                checked={selectAll}
                                                size={'large'}
                                                onChange={handleSelectAll}
                                            />
                                            <span className="font-semibold text-sm text-gray-900">Select All</span>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {selectedPageIds.length} of {pages.length} selected
                                        </span>
                                    </label>
                                </div>

                                {/* Search Section */}
                                <div className="bg-white px-4 py-3 border-b border-gray-200">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <SvgIcon icon={searchIcon} className="text-gray-400" size="medium" />
                                        </div>
                                        <Input
                                            placeholder="Search pages..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="w-full pl-10 pr-10 h-10 text-sm"
                                        />
                                        {searchQuery && (
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <BaseButton
                                                    color="none"
                                                    onClick={() => setSearchQuery('')}
                                                    title="Clear search"
                                                    className="!p-1 !text-gray-400 hover:!text-gray-600 !border-0"
                                                    aria-label="Clear search"
                                                >
                                                    <SvgIcon icon={xIcon} size="small" />
                                                </BaseButton>
                                            </div>
                                        )}
                                    </div>
                                    {searchQuery && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Showing {filteredPages.length} of {pages.length} pages
                                        </p>
                                    )}
                                </div>

                                {/* Pages List */}
                                <div className="max-h-80 overflow-y-auto bg-white">
                                    {filteredPages.length > 0 ? (
                                        filteredPages.map((page, index) => {
                                            const isSelected = selectedPageIdsSet.has(page.pageId);
                                            return (
                                                <label
                                                    key={page.pageId}
                                                    className={`page-row flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors ${
                                                        index !== filteredPages.length - 1 ? 'border-b border-gray-100' : ''
                                                    }`}
                                                >
                                                    <Checkbox
                                                        checked={isSelected}
                                                        size={'large'}
                                                        onChange={() => handlePageToggle(page.pageId)}
                                                    />
                                                    <span className="text-sm text-gray-900 flex-1">{page.pageTitle}</span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8 px-4">
                                            <SvgIcon icon={searchIcon} className="text-gray-300 mx-auto mb-2" size="xlarge" />
                                            <p className="text-sm text-gray-500 mb-3">
                                                No pages found matching "{searchQuery}"
                                            </p>
                                            <BaseButton
                                                color="none"
                                                onClick={() => setSearchQuery('')}
                                                className="!text-blue-600 hover:!text-blue-700 !font-medium !text-sm"
                                            >
                                                Clear search
                                            </BaseButton>
                                        </div>
                                    )}
                                </div>
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