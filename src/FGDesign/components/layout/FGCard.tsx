import React from 'react';
import type { ReactNode } from 'react';
import { Card, type CardProps } from '@progress/kendo-react-layout';
import { useFGTheme } from '../../theme/useFGTheme';

interface FGCardProps extends Omit<CardProps, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FGCard: React.FC<FGCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...cardProps
}) => {
  const theme = useFGTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          boxShadow: theme.shadows.lg,
          border: 'none',
        } as React.CSSProperties;
      case 'outlined':
        return {
          boxShadow: 'none',
          border: `1px solid ${theme.colors.secondary[200]}`,
        } as React.CSSProperties;
      default:
        return {
          boxShadow: theme.shadows.base,
          border: 'none',
        } as React.CSSProperties;
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 } as React.CSSProperties;
      case 'sm':
        return { padding: theme.spacing.sm } as React.CSSProperties;
      case 'md':
        return { padding: theme.spacing.md } as React.CSSProperties;
      case 'lg':
        return { padding: theme.spacing.lg } as React.CSSProperties;
      case 'xl':
        return { padding: theme.spacing.xl } as React.CSSProperties;
      default:
        return { padding: theme.spacing.md } as React.CSSProperties;
    }
  };

  const cardStyles = {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    transition: theme.transitions.normal,
    ...getVariantStyles(),
    ...getPaddingStyles(),
  } as React.CSSProperties;

  return (
    <Card {...cardProps} style={cardStyles} className={`fg-card ${className}`}>
      {children}
    </Card>
  );
};

