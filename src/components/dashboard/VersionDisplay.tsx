export const VersionDisplay = ({ version, isBold = false }: { version: string | number, isBold?: boolean }) => (
    <span className={isBold ? 'font-bold' : ''}>v{version}</span>
);