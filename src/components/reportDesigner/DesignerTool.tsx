import { useState, useRef, useEffect } from 'react';
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

function DesignerTool() {
    const [isLoading, setIsLoading] = useState(true);
    const designerRef = useRef<any>(null);

    // Example: tweak menu actions
    const onCustomizeMenuActions = ({ args }: { args: any }) => {
        const newReport = args.GetById(ActionId.NewReport);
        if (newReport) newReport.visible = false; // demo: hide "New Report"
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
        }, 10000); // 10 second fallback

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
                    reportUrl="TestReport"
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
                    <DesignerModelSettings allowMDI>
                        <DataSourceSettings
                            allowAddDataSource={false}
                            allowRemoveDataSource={false}
                        />
                        <PreviewSettings>
                            <WizardSettings useFullscreenWizard={false} />
                        </PreviewSettings>
                    </DesignerModelSettings>
                </ReportDesigner>
            </div>
        </div>
    );
}

export default DesignerTool;