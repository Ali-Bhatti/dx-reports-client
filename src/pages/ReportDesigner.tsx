import React from "react";
import ActionBar from "../components/reportDesigner/ActionBar";
import ReportDesigner from "../components/reportDesigner/DesignerTool";


function ReportDesignerPage() {
    return (
        <div className="min-h-screen bg-neutral-100">
            <div className="p-5 px-25">
                <ActionBar />
            </div>
            <ReportDesigner />
        </div>
    );
}

export default ReportDesignerPage;