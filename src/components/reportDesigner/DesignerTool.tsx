import {
    useState,
    useRef,
    useEffect
} from 'react';
import ReportDesigner, {
    RequestOptions,
    DesignerModelSettings,
    PreviewSettings,
    DataSourceSettings,
    WizardSettings,
    Callbacks,
    type DxReportDesignerRef
} from 'devexpress-reporting-react/dx-report-designer';
import { ActionId } from 'devexpress-reporting/dx-reportdesigner';
import { Loader } from '@progress/kendo-react-indicators';
import BaseCard from '../shared/BaseCard';
import ActionBar from './ActionBar';

import {
    ExportSettings,
    ProgressBarSettings,
    SearchSettings
} from 'devexpress-reporting-react/dx-report-viewer';

function DesignerTool() {
    const [isLoading, setIsLoading] = useState(true);
    const designerRef = useRef<DxReportDesignerRef>(null);

    const doSaveReport = () => {
        console.log('Saving report...');
        designerRef.current?.instance().SaveReport();
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
            //ActionId.Save,
            ActionId.SaveAs,
            //ActionId.Preview,
            ActionId.Scripts,
            ActionId.AddDataSource,
            //ActionId.ValidateBindings,
            //ActionId.FullScreen
        ];

        hideMenuItems.forEach(actionId => {
            const action = args.GetById(actionId);
            if (action) {
                action.visible = false;
            }
        });
    };

    const onCustomizeElements = ({ sender, args }: { sender: any, args: any }) => {
        // Hide the "Add new data source" button in Field List
        if (args && args.GetById) {
            const fieldList = args.GetById('fieldList');
            if (fieldList && fieldList.dataSourceHelper) {
                if (fieldList.dataSourceHelper.canAddDataSource) {
                    fieldList.dataSourceHelper.canAddDataSource = false;
                }
            }

            if (fieldList && fieldList.actions) {
                const addAction = fieldList.actions().find((action: any) =>
                    action.id === 'addDataSource' || action.id === 'add-datasource'
                );
                if (addAction) {
                    addAction.visible = false;
                }
            }
        }

        if (sender && sender._propertyGrid) {
            const propertyGrid = sender._propertyGrid;

            propertyGrid.editorsInfo.subscribe((editors: any) => {
                editors.forEach((editor: any) => {
                    if (editor.propertyName === 'DataSource') {
                        editor.disabled = true;
                    }
                });
            });
        }

        if (args && args.GetById) {
            const propertyGrid = args.GetById('propertyGrid');
            if (propertyGrid) {
                const dataSourceProperty = propertyGrid.findProperty &&
                    propertyGrid.findProperty('DataSource');

                if (dataSourceProperty) {
                    dataSourceProperty.disabled = true;
                }
            }
        }
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

    function onBeforeRender(event: any): void {
        console.log("Before Render");

        console.log("EVENT--------", event);
        console.log("SENDER----------", event.sender);

        var info = event.sender.GetPropertyInfo("DevExpress.XtraReports.UI.XtraReport", "Border Color");
        console.log("INFO---------", info);

        if (info.defaultVal == "Black") info.disabled = false;

        info = event.sender.GetPropertyInfo("DevExpress.XtraReports.UI.XtraReport", ["Watermarks"]);
        info.visible = false;

        info = event.sender.GetPropertyInfo("DevExpress.XtraReports.UI.XtraReport", "DrawWatermark");
        info.visible = false;

        info = event.sender.GetPropertyInfo("DevExpress.XtraReports.UI.XtraReport", "ExportOptions.Csv.Separator");
        info.visible = false;

        info = event.sender.GetPropertyInfo("XRLabel", "Can Grow");
        info.disabled = true;

        info = event.sender.GetPropertyInfo("XRLabel", "EditOptions");
        console.log("INFO LABEL---------", info);
        info.visible = false;
    }

    const onReportOpened = () => {
        console.log("ReportOpened");
    };

    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => {
            clearTimeout(fallbackTimer);
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
                        <Loader
                            type="pulsing"
                            themeColor="primary"
                        />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Loading Report Designer
                            </h3>
                        </div>
                    </div>
                </BaseCard>
            )}

            <div
                className={
                    `bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-opacity duration-300 
                    ${isLoading ? 'opacity-0' : 'opacity-100'}`
                }
            >
                <ReportDesigner
                    ref={designerRef}
                    reportUrl="XtraReport1"
                >
                    <RequestOptions
                        host={import.meta.env.VITE_DX_HOST}
                        getDesignerModelAction="DXXRD/GetDesignerModel"
                    />
                    <Callbacks
                        CustomizeMenuActions={onCustomizeMenuActions}
                        CustomizeElements={onCustomizeElements}
                        ComponentAdded={onComponentAdded}
                        BeforeRender={onBeforeRender}
                        ReportOpened={onReportOpened}
                    />
                    <DesignerModelSettings allowMDI={false}>
                        <DataSourceSettings
                            allowAddDataSource={false}
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
            </div>
        </div>
    );
}

export default DesignerTool;