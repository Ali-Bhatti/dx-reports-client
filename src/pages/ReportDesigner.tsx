import { useEffect } from "react";
import ActionBar from "../components/reportDesigner/ActionBar";
import ReportDesignerTool from "../components/reportDesigner/DesignerTool";


function ReportDesignerPage() {
    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="p-5 px-25">
            <ActionBar />
            <ReportDesignerTool />
        </div>
    );
}

export default ReportDesignerPage;