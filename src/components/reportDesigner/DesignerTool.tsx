import {
    useState,
    useRef,
    useEffect
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { setActionContext } from '../../features/reports/reportsSlice';
import ReportDesigner, {
    RequestOptions,
    DesignerModelSettings,
    PreviewSettings,
    DataSourceSettings,
    WizardSettings,
    Callbacks,
    type DxReportDesignerRef
} from 'devexpress-reporting-react/dx-report-designer';
import 'devexpress-reporting/dx-richedit';
import { ActionId } from 'devexpress-reporting/dx-reportdesigner';
import BaseCard from '../shared/BaseCard';
import ActionBar from './ActionBar';
import BaseLoader from '../shared/BaseLoader';

import {
    ExportSettings,
    ProgressBarSettings,
    SearchSettings
} from 'devexpress-reporting-react/dx-report-viewer';
import moment from 'moment';
import config from '../../config/config';


function DesignerTool() {
    const [isLoading, setIsLoading] = useState(true);
    const designerRef = useRef<DxReportDesignerRef>(null);
    const dispatch = useDispatch();

    // Get data from Redux store
    const actionContext = useSelector((state: RootState) => state.reports.actionContext);

    // Initialize reportUrl from actionContext - using reportLayoutID for loading the designer
    const [reportUrl, setReportUrl] = useState(
        actionContext.selectedVersion?.id
            ? `${actionContext.selectedVersion.id}`
            : ""
    );

    const isNewVersion = actionContext.type === 'new_version';
    const doSaveReport = async () => {
        console.log('doSaveReport called. isNewVersion:', isNewVersion);
        if (isNewVersion) {
            console.log('Adding new version...');
            // For new version, use reportLayoutID as the base
            const reportLayoutID = actionContext.selectedVersion?.reportLayoutID;
            const newReportUrl = `${actionContext.selectedVersion?.reportLayoutID}`;
            setReportUrl(newReportUrl);

            // SaveNewReport returns a promise with the new ID
            try {
                let result = await designerRef.current?.instance().SaveNewReport(newReportUrl);
                console.log('New version saved, result:', result);
                result = result && JSON.parse(result);
                console.log('Parsed result:', result);

                // Update reportUrl with the returned ID and switch context to save mode
                if (result) {
                    setReportUrl(`${result.version_id}`);

                    // Update action context to 'edit' mode with new IDs
                    dispatch(setActionContext({
                        type: 'edit',
                        versionId: result.version_id,
                        selectedVersion: {
                            id: result.version_id,
                            version: result.version,
                            reportLayoutID,
                            createdOn: moment().toISOString(),
                            isPublished: false,
                            isDefault: false,
                        }
                    }));
                }
            } catch (error) {
                console.error('Error saving new report version:', error);
            }
        } else {
            console.log('Saving current report...');
            // For regular save, use version id
            const saveReportUrl = `${actionContext.selectedVersion?.id}`;
            setReportUrl(saveReportUrl);
            designerRef.current?.instance().SaveReport();
        }
    };

    const doDownloadReport = () => {
        console.log('Downloading report...');
        // Add your download logic here
        // For example, you might want to export the report
        // designerRef.current?.instance().ExportReport(...);
    };

    const onCustomizeMenuActions = ({ args }: { args: any }) => {
        const hideMenuItems = [
            ActionId.NewReport,
            ActionId.OpenReport,
            ActionId.NewReportViaWizard,
            ActionId.ReportWizard,
            ActionId.SaveAs,
            ActionId.Scripts,
            ActionId.AddDataSource,
            ActionId.Exit,
        ];

        hideMenuItems.forEach(actionId => {
            const action = args.GetById(actionId);
            if (action) {
                action.visible = false;
            }
        });
    };


    const onComponentAdded = ({ args }: { args: any }) => {
        if (args && args.model) {
            const component = args.model;

            if (component['@ControlType'] === 'XRLabel') {
                const textBinding = component.ExpressionBindings &&
                    component.ExpressionBindings().find((b: any) => b.PropertyName === 'Text');

                if (textBinding) {
                    const expression = textBinding.Expression;
                    const fieldName = expression.replace(/[\[\]]/g, '').split('.').pop();

                    if (!component.Text || component.Text() === '') {
                        component.Text(fieldName || expression);
                    }
                }
            }
        }

        if (args && args.parent && args.parent.getPropertyByName) {
            const dataSourceProp = args.parent.getPropertyByName('DataSource');
            if (dataSourceProp) {
                dataSourceProp.disabled = true;
            }
        }
    };

    function onBeforeRender(_event: any): void {
        console.log("Before Render");
    }

    const onReportOpened = () => {
        console.log("ReportOpened");
    };

    useEffect(() => {
        // Update reportUrl when actionContext changes
        if (actionContext.selectedVersion?.id) {
            const newReportUrl = `${actionContext.selectedVersion.id}`;
            if (reportUrl !== newReportUrl) {
                setReportUrl(newReportUrl);
            }
        }
    }, [actionContext.selectedVersion?.id, reportUrl]);

    useEffect(() => {
        // Hide DevExpress notification bar
        const hideNotificationBar = () => {
            const notificationBar = document.querySelector('.dxrd-notification-bar');
            if (notificationBar && notificationBar instanceof HTMLElement) {
                notificationBar.style.display = 'none';
            }
        };

        // Try to hide immediately and after a delay
        hideNotificationBar();
        const notificationTimer = setInterval(hideNotificationBar, 500);

        const fallbackTimer = setTimeout(() => {
            setIsLoading(false);
            clearInterval(notificationTimer);
        }, 3000);

        return () => {
            clearTimeout(fallbackTimer);
            clearInterval(notificationTimer);
        };
    }, []);

    return (
        <div className="relative">
            <div className='mb-5'>
                <ActionBar
                    isLoading={isLoading}
                    onSave={doSaveReport}
                    onDownload={doDownloadReport}
                />
            </div>

            {isLoading && (
                <BaseCard>
                    <div className="flex flex-col items-center space-y-4 p-8">
                        <BaseLoader
                            type="pulsing"
                            themeColor="primary"
                            loadingText="Loading Report Designer"
                        />
                    </div>
                </BaseCard>
            )}

            <div
                className={
                    `bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-opacity duration-300
                    ${isLoading ? 'opacity-0' : 'opacity-100'}`
                }
            >
                {reportUrl ? (
                    <ReportDesigner
                        ref={designerRef}
                        reportUrl={String(reportUrl)}
                    >
                        <RequestOptions
                            host={config.dxHost}
                            getDesignerModelAction="DXXRD/GetDesignerModel"
                        />
                        <Callbacks
                            CustomizeMenuActions={onCustomizeMenuActions}
                            ComponentAdded={onComponentAdded}
                            BeforeRender={onBeforeRender}
                            ReportOpened={onReportOpened}
                        />
                        <DesignerModelSettings allowMDI={true}>
                            <DataSourceSettings
                                allowAddDataSource={true}
                                allowRemoveDataSource={false}
                                allowEditDataSource={false}
                            />
                            <PreviewSettings>
                                <WizardSettings useFullscreenWizard={false} />
                                <ExportSettings useSameTab={false} />
                                <ProgressBarSettings position='TopRight' />
                                <SearchSettings searchEnabled={false} />
                            </PreviewSettings>
                            <WizardSettings useFullscreenWizard={false} />
                        </DesignerModelSettings>
                    </ReportDesigner>
                ) : (
                    <div className="flex items-center justify-center p-8">
                        <p className="text-gray-500">No report layout selected</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DesignerTool;