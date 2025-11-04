import { useEffect, useState, useRef } from "react";
import { useNavigate, useBlocker } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReportDesignerTool from "../components/reportDesigner/DesignerTool";
import BaseButton from "../components/shared/BaseButton";
import { reportsApi } from "../services/reportsApi";
import { selectIsDesignerModified } from "../features/reports/reportsSelectors";
import { setDesignerModified } from "../features/reports/reportsSlice";


function ReportDesignerPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDesignerLoaded, setIsDesignerLoaded] = useState(false);
    const hasUnsavedChanges = useSelector(selectIsDesignerModified);
    const isNavigatingRef = useRef(false);

    // Block navigation when there are unsaved changes (except when programmatically navigating)
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            hasUnsavedChanges &&
            currentLocation.pathname !== nextLocation.pathname &&
            !isNavigatingRef.current
    );

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        // Cleanup: Reset designer modified state when component unmounts
        return () => {
            dispatch(setDesignerModified(false));
            isNavigatingRef.current = false;
        };
    }, [dispatch]);

    // Handle browser navigation (refresh, close tab, etc.)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    // Handle blocker state changes (for Home link, browser back, etc.)
    useEffect(() => {
        if (blocker.state === 'blocked') {
            const shouldLeave = window.confirm(
                'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.'
            );

            if (shouldLeave) {
                dispatch(setDesignerModified(false));
                blocker.proceed();
            } else {
                blocker.reset();
            }
        }
    }, [blocker, dispatch]);

    const handleBackToDashboard = () => {
        if (hasUnsavedChanges) {
            const shouldLeave = window.confirm(
                'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.'
            );

            if (!shouldLeave) {
                return;
            }
        }

        // Set flag to bypass blocker for this programmatic navigation
        isNavigatingRef.current = true;
        dispatch(setDesignerModified(false));

        // Invalidate the versions cache to force refetch
        dispatch(reportsApi.util.invalidateTags(['ReportVersion']));
        navigate('/');
    };

    const handleDesignerLoaded = () => {
        setIsDesignerLoaded(true);
    };

    return (
        <div>
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