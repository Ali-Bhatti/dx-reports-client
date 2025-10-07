import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportDesignerTool from "../components/reportDesigner/DesignerTool";
import BaseButton from "../components/shared/BaseButton";


function ReportDesignerPage() {
    const navigate = useNavigate();
    const [isDesignerLoaded, setIsDesignerLoaded] = useState(false);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    const handleBackToDashboard = () => {
        navigate('/');
    };

    const handleDesignerLoaded = () => {
        setIsDesignerLoaded(true);
    };

    return (
        <div className="p-5 px-25">
            {/* Back Button */}
            <div className="mb-4">
                <BaseButton
                    onClick={handleBackToDashboard}
                    color="gray"
                    className="!px-4 !py-2"
                    disabled={!isDesignerLoaded}
                >
                    <svg
                        className="w-4 h-4 mr-2 inline-block"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to Dashboard
                </BaseButton>
            </div>

            <ReportDesignerTool onDesignerLoaded={handleDesignerLoaded} />
        </div>
    );
}

export default ReportDesignerPage;