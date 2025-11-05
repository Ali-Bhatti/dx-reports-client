import {
    useState,
    useRef,
    useEffect
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { setActionContext, setDesignerModified } from '../../features/reports/reportsSlice';
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

    const actionContext = useSelector((state: RootState) => state.reports.actionContext);
    const dxHost = useSelector((state: RootState) => state.app.currentEnvironment?.url);

    const [reportUrl, setReportUrl] = useState(
        actionContext.selectedVersion?.id
            ? `${actionContext.selectedVersion.id}`
            : ""
    );

    const isNewVersion = actionContext.type === 'new_version';
    const doSaveReport = async () => {

        if (isNewVersion) {
            // For new version, use reportLayoutID as the base
            const reportLayoutID = actionContext.selectedVersion?.reportLayoutID;
            const newReportUrl = `${actionContext.selectedVersion?.reportLayoutID}`;
            const openTabVersionId = actionContext.selectedVersion?.id;



            // SaveNewReport returns a promise with the new ID from backend
            try {
                let result = await designerRef.current?.instance().SaveNewReport(newReportUrl);
                result = result && JSON.parse(result);

                if (result) {
                    // Close the old tab (template/base version) before the new one opens
                    const tabs = designerRef.current?.instance().GetTabs() as NavigateTab[];
                    const currentTab = tabs?.find(tab => tab.url() === String(openTabVersionId));
                    if (currentTab) {
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
                            creationDate: moment().toISOString(),
                            isPublished: false,
                            isDefault: false,
                        }
                    }));
                }
            } catch (error) {
                console.error('Error saving new report version:', error);
            }
        } else {
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
            ActionId.Save,
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
    }

    const onReportOpened = () => {
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
                //console.log('Checking modified status...', designerRef.current.instance().IsModified());
                const isCurrentlyModified = designerRef.current.instance().IsModified();
                setIsModified(isCurrentlyModified);
            }
        };

        // Check every 1000ms for changes
        const interval = setInterval(checkModifiedStatus, 1000);

        return () => clearInterval(interval);
    }, []);

    // Update Redux store when modified state changes
    useEffect(() => {
        dispatch(setDesignerModified(isModified));
    }, [isModified, dispatch]);

    useEffect(() => {
        if (actionContext.selectedVersion?.id) {
            const newReportUrl = `${actionContext.selectedVersion.id}`;
            if (reportUrl !== newReportUrl) {
                setReportUrl(newReportUrl);
            }
        } else {
            setIsLoading(false);
            onDesignerLoaded?.();
        }
    }, [actionContext.selectedVersion?.id, actionContext.type]);


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
                            host={dxHost ?? ""}
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
                                allowAddDataSource={false}
                                allowRemoveDataSource={false}
                                allowEditDataSource={true}
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
                    <div className="flex flex-col items-center justify-center p-12 space-y-4">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No Report Selected</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Please select a report from the dashboard to start editing
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DesignerTool;