import { useEffect } from "react";
import ActionBar from "../components/reportDesigner/ActionBar";
import ReportDesigner from "../components/reportDesigner/DesignerTool";


function ReportDesignerPage() {
    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="p-5 px-25">
            <ActionBar />
            <ReportDesigner />
        </div>
    );
}

export default ReportDesignerPage;