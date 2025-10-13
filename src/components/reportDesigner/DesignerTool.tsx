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

// import { ShowMessage, NotifyType } from '@devexpress/analytics-core/core/utils/_infoMessageHelpers';
// import { getLocalization } from '@devexpress/analytics-core/property-grid/localization/localization_utils';
import { NavigateTab } from 'devexpress-reporting/dx-reportdesigner'


interface DesignerToolProps {
    onDesignerLoaded?: () => void;
}

function DesignerTool({ onDesignerLoaded }: DesignerToolProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isModified, setIsModified] = useState(false);
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
        console.log('Current Designer Modified State:--------', designerRef.current?.instance().IsModified());

        if (isNewVersion) {
            console.log('Adding new version...');
            // For new version, use reportLayoutID as the base
            const reportLayoutID = actionContext.selectedVersion?.reportLayoutID;
            const newReportUrl = `${actionContext.selectedVersion?.reportLayoutID}`;
            const openTabVersionId = actionContext.selectedVersion?.id;

            console.log('openTabVersionId:', openTabVersionId);


            // SaveNewReport returns a promise with the new ID from backend
            try {
                let result = await designerRef.current?.instance().SaveNewReport(newReportUrl);
                console.log('New version saved, result:', result);
                result = result && JSON.parse(result);
                console.log('Parsed result:', result);

                // Update reportUrl with the returned ID and switch context to save mode
                if (result) {
                    // Close the old tab (template/base version) before the new one opens
                    const tabs = designerRef.current?.instance().GetTabs() as NavigateTab[];
                    console.log('Current tabs:', tabs.map(tab => tab.url()));
                    const currentTab = tabs?.find(tab => tab.url() === String(openTabVersionId));
                    console.log("Condition for OPEN TAB---------------", currentTab?.url());
                    if (currentTab) {
                        console.log("Closing tab:", currentTab?.url());
                        // Reset the modified state of the tab before closing to prevent confirmation dialog
                        if (currentTab.resetIsModified && typeof currentTab.resetIsModified === 'function') {
                            currentTab.resetIsModified();
                        }
                        await designerRef.current?.instance().CloseTab(currentTab, true);
                    }

                    // Update reportUrl to the new version ID
                    const newVersionUrl = `${result.version_id}`;
                    setReportUrl(newVersionUrl);

                    // Update action context to 'edit' mode with new IDs
                    await dispatch(setActionContext({
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

                    // After successful save, reset modified state
                    //designerRef.current?.instance().ResetIsModified();
                    //setIsModified(false);
                }
            } catch (error) {
                console.error('Error saving new report version:', error);
            }
        } else {
            console.log('Saving current report...');
            //clickMenuItem(ActionId.Save);
            await designerRef.current?.instance().SaveReport();
            designerRef.current?.instance().ResetIsModified();
        }
    };

    // generic function to click the option from menu which are passed as parameter
    // const clickMenuItem = (menuItemId: string) => {
    //     const designer = designerRef.current?.instance();
    //     if (designer) {
    //         const designerModel = designer.GetDesignerModel();
    //         if (designerModel) {
    //             const menuItem = designerModel.actionLists.menuItems.find((item: any) => item.id === menuItemId);
    //             if (menuItem && menuItem?.clickAction) {
    //                 menuItem.clickAction();
    //             }
    //         }
    //     }
    // };

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
        // Mark designer as modified when a component is added
        setIsModified(true);

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
        // Reset modified state when a report is opened
        setIsModified(false);
        // Hide loading indicator when report is actually loaded
        setIsLoading(false);
        // Notify parent that designer has loaded
        onDesignerLoaded?.();
    };

    useEffect(() => {
        const checkModifiedStatus = () => {
            if (designerRef.current?.instance()) {
                const isCurrentlyModified = designerRef.current.instance().IsModified();
                setIsModified(isCurrentlyModified);
            }
        };

        // Check every 100ms for changes
        const interval = setInterval(checkModifiedStatus, 100);

        return () => clearInterval(interval);
    }, [isModified]);

    useEffect(() => {
        // Update reportUrl when actionContext changes
        if (actionContext.selectedVersion?.id) {
            const newReportUrl = `${actionContext.selectedVersion.id}`;
            // Only update if the URL actually changed to prevent unnecessary re-renders
            if (reportUrl !== newReportUrl) {
                console.log("Action Context Changed - Updating reportUrl from", reportUrl, "to", newReportUrl);
                setReportUrl(newReportUrl);
            }
        }
    }, [actionContext.selectedVersion?.id, actionContext.type]);

    useEffect(() => {
        // Hide DevExpress notification bar
        const hideNotificationBar = () => {
            const notificationBar = document.querySelector('.dxrd-notification-bar');
            if (notificationBar && notificationBar instanceof HTMLElement) {
                notificationBar.style.display = 'none';
            }
        };

        // Try to hide immediately and periodically
        hideNotificationBar();
        //const notificationTimer = setInterval(hideNotificationBar, 500);

        // Fallback timeout in case ReportOpened event doesn't fire (e.g., errors)
        const fallbackTimer = setTimeout(() => {
            setIsLoading(false);
            onDesignerLoaded?.();
            console.warn('Designer loading fallback timeout triggered');
        }, 10000); // 10 seconds fallback

        return () => {
            clearTimeout(fallbackTimer);
            //clearInterval(notificationTimer);
        };
    }, []);

    return (
        <div className="relative">
            <div className='mb-5'>
                <ActionBar
                    isLoading={isLoading}
                    isDesignerModified={isModified}
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
                        <DesignerModelSettings allowMDI={false}>
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