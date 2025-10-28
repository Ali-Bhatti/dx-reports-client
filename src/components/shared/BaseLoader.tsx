import { Loader, type LoaderProps } from '@progress/kendo-react-indicators';

interface BaseLoaderProps extends LoaderProps {
    loadingText?: string;
    loadingTextSize?: string;
    bottomPadding?: boolean;
}

const BaseLoader = ({
    loadingText,
    size = 'medium',
    type = 'converging-spinner',
    loadingTextSize = 'text-xl',
    bottomPadding = false,
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
                <div className={`text-center mt-1 ${bottomPadding ? 'mb-3' : ''}`}>
                    <h3 className={`${loadingTextSize} font-semibold text-gray-800`}>
                        {loadingText}
                    </h3>
                </div>
            )}
        </>
    );
};

export default BaseLoader;
