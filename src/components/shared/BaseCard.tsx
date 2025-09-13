import * as React from 'react';

type SlotProps = React.PropsWithChildren<{
  className?: string;
  /** Override the root setting for this section only */
  divider?: boolean;
}>;

type BaseCardProps = React.PropsWithChildren<{
  className?: string;
  /** Show header/footer divider lines (default: true) */
  dividers?: boolean;
}>;

// Context to pass the root "dividers" default to sections
const DividerCtx = React.createContext<boolean>(true);

type BaseCardCompound = React.FC<BaseCardProps> & {
  Header: React.FC<SlotProps>;
  Body:   React.FC<SlotProps>;
  Footer: React.FC<SlotProps>;
};

const BaseCardRoot: React.FC<BaseCardProps> = ({
  className = '',
  dividers = true,
  children
}) => (
  <section
    className={[
      'bg-white border border-gray-200 rounded-xl shadow-sm',
      'p-4 sm:p-5',
      className
    ].join(' ')}
  >
    <DividerCtx.Provider value={dividers}>{children}</DividerCtx.Provider>
  </section>
);

const Header: React.FC<SlotProps> = ({ className = '', divider, children }) => {
  const rootDividers = React.useContext(DividerCtx);
  const show = divider ?? rootDividers;
  return (
    <header
      className={[
        'flex items-center justify-between gap-3',
        'pb-1',
        show ? 'border-b border-gray-100' : '',
        className
      ].join(' ')}
    >
      {children}
    </header>
  );
};

const Body: React.FC<SlotProps> = ({ className = '', children }) => (
  <div className={['relative py-3 sm:py-4', className].join(' ')}>{children}</div>
);

const Footer: React.FC<SlotProps> = ({ className = '', divider, children }) => {
  const rootDividers = React.useContext(DividerCtx);
  const show = divider ?? rootDividers;
  return (
    <footer
      className={[
        'flex items-center justify-between gap-3',
        'pt-3 sm:pt-4',
        show ? 'border-t border-gray-100' : '',
        className
      ].join(' ')}
    >
      {children}
    </footer>
  );
};

const BaseCard = Object.assign(BaseCardRoot, { Header, Body, Footer }) as BaseCardCompound;
export default BaseCard;
