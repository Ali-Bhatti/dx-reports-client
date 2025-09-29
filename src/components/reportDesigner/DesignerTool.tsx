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
    Callbacks
} from 'devexpress-reporting-react/dx-report-designer';
import { ActionId } from 'devexpress-reporting/dx-reportdesigner';
import { Loader } from '@progress/kendo-react-indicators';
import BaseCard from '../shared/BaseCard';

import {
    ExportSettings,
    ProgressBarSettings,
    SearchSettings
} from 'devexpress-reporting-react/dx-report-viewer';



function DesignerTool() {
    const [isLoading, setIsLoading] = useState(true);
    const designerRef = useRef<any>(null);

    const onCustomizeMenuActions = ({ args }: { args: any }) => {
        // Array of menu items to hide
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
            ActionId.ValidateBindings,
            ActionId.FullScreen
        ];

        // Loop through and hide each menu item
        hideMenuItems.forEach(actionId => {
            const action = args.GetById(actionId);
            if (action) {
                action.visible = false;
            }
        });

        // Localization and Exit remain visible by default
    };

    // Handle designer initialization callbacks
    const onBeforeRender = () => {
        console.log("Before Render")
    };

    const onReportOpened = () => {
        console.log("ReportOpened")
    };

    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // 10 second fallback

        return () => clearTimeout(fallbackTimer);
    }, []);

    return (
        <div className="relative mt-5">
            {/* Loading Overlay */}
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

            {/* Designer Container */}
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
                        BeforeRender={onBeforeRender}
                        ReportOpened={onReportOpened}
                    />
                    <DesignerModelSettings allowMDI={true}>
                        <DataSourceSettings
                            allowAddDataSource={false}
                            allowRemoveDataSource={true}
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