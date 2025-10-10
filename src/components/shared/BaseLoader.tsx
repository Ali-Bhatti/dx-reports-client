import { Loader, type LoaderProps } from '@progress/kendo-react-indicators';

interface BaseLoaderProps extends LoaderProps {
    loadingText?: string;
    loadingTextSize?: string;
}

const BaseLoader = ({
    loadingText,
    size = 'medium',
    type = 'converging-spinner',
    loadingTextSize = 'text-xl',
    ...rest
}: BaseLoaderProps) => {
    return (
        <>
            <Loader
                size={size}
                type={type}
                {...rest}
            />
            {loadingText && (
                <div className="text-center mt-1">
                    <h3 className={`${loadingTextSize} font-semibold text-gray-800 mb-3`}>
                        {loadingText}
                    </h3>
                </div>
            )}
        </>
    );
};

export default BaseLoader;
