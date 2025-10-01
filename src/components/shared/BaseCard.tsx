import {
  createContext,
  useContext,
  type ReactElement,
  type PropsWithChildren,
} from 'react';

type SlotProps = PropsWithChildren<{
  className?: string;
  /** Override the root setting for this section only */
  divider?: boolean;
}>;

type BaseCardProps = PropsWithChildren<{
  className?: string;
  /** Show header/footer divider lines (default: true) */
  dividers?: boolean;
}>;

// Context to pass the root "dividers" default to sections 
const DividerCtx = createContext<boolean>(true);

type BaseCardCompound = ((props: BaseCardProps) => ReactElement) & {
  Header: (props: SlotProps) => ReactElement;
  Body: (props: SlotProps) => ReactElement;
  Footer: (props: SlotProps) => ReactElement;
};

const BaseCardRoot = ({
  className = '',
  dividers = true,
  children
}: BaseCardProps) => (
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

const Header = ({ className = '', divider, children }: SlotProps) => {
  const rootDividers = useContext(DividerCtx);
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

const Body = ({ className = '', children }: SlotProps) => (
  <div className={['relative py-3 sm:py-4', className].join(' ')}>{children}</div>
);

const Footer = ({ className = '', divider, children }: SlotProps) => {
  const rootDividers = useContext(DividerCtx);
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