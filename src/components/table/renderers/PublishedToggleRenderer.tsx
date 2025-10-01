import { useDispatch } from 'react-redux';
import type { ICellRendererParams } from 'ag-grid-community';
import BaseSwitch from '../../shared/BaseSwitch';
import { clearSelectedVersionIds } from '../../../features/reports/reportsSlice';
import type { ReportVersion as HistoryRow } from '../../../types';

type VersionRowWithPublished = HistoryRow & { published: boolean };

interface PublishedToggleRendererProps extends ICellRendererParams<VersionRowWithPublished, boolean> {
    onPublish?: (versionId: number) => void;
    onUnpublish?: (versionId: number) => void;
}

const PublishedToggleRenderer = ({
    data,
    value,
    onPublish,
    onUnpublish
}: PublishedToggleRendererProps) => {
    const dispatch = useDispatch();
    const versionData = data!;

    const handleSwitchChange = async (event: any) => {
        if (event.syntheticEvent && event.syntheticEvent.stopPropagation) {
            event.syntheticEvent.stopPropagation();
        }

        dispatch(clearSelectedVersionIds());

        const checked = event.target.value;

        if (checked) {
            onPublish?.(Number(versionData.id));
        } else {
            onUnpublish?.(Number(versionData.id));
        }
    };

    return (
        <div className="flex w-full justify-center p-2">
            <BaseSwitch
                checked={!!value}
                onChange={handleSwitchChange}
            />
        </div>
    );
};

export default PublishedToggleRenderer;