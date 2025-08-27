import ReportDesigner, {
  RequestOptions,
  DesignerModelSettings,
  PreviewSettings,
  DataSourceSettings,
  WizardSettings,
  Callbacks
} from 'devexpress-reporting-react/dx-report-designer';
import { ActionId } from 'devexpress-reporting/dx-reportdesigner';

export default function App() {
  // Example: tweak menu actions
  const onCustomizeMenuActions = ({
    args
  }: {
    args: { GetById: (id: unknown) => unknown };
  }) => {
    const newReport = args.GetById(ActionId.NewReport) as
      | { visible: boolean }
      | undefined;
    if (newReport) newReport.visible = false; // demo: hide "New Report"
  };

  return (
    <div style={{ height: '100dvh', width: '100%' }}>
      <ReportDesigner reportUrl="TestReport">
        <RequestOptions
          host={import.meta.env.VITE_DX_HOST}
          getDesignerModelAction="DXXRD/GetDesignerModel"
        />
        <Callbacks CustomizeMenuActions={onCustomizeMenuActions} />
        <DesignerModelSettings allowMDI>
          <DataSourceSettings allowAddDataSource={false} allowRemoveDataSource={false} />
          <PreviewSettings>
            <WizardSettings useFullscreenWizard={false} />
          </PreviewSettings>
        </DesignerModelSettings>
      </ReportDesigner>
    </div>
  );
}
