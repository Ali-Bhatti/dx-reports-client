import React from 'react';
import { Button, type ButtonProps } from '@progress/kendo-react-buttons';
import { useFGTheme } from '../../theme/useFGTheme';

interface FGButtonProps extends Omit<ButtonProps, 'children' | 'size'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}

export const FGButton: React.FC<FGButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...buttonProps
}) => {
  const theme = useFGTheme();

  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: theme.borderRadius.md,
      border: 'none',
      fontWeight: theme.typography.fontWeight.medium,
      transition: theme.transitions.normal,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
    } as React.CSSProperties;

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.secondary[100],
          color: theme.colors.secondary[700],
          '&:hover': {
            backgroundColor: theme.colors.secondary[200],
          },
        } as React.CSSProperties;
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.success[500],
          color: theme.colors.neutral.white,
          '&:hover': {
            backgroundColor: theme.colors.success[600],
          },
        } as React.CSSProperties;
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.warning[500],
          color: theme.colors.neutral.white,
          '&:hover': {
            backgroundColor: theme.colors.warning[600],
          },
        } as React.CSSProperties;
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.error[500],
          color: theme.colors.neutral.white,
          '&:hover': {
            backgroundColor: theme.colors.error[600],
          },
        } as React.CSSProperties;
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.colors.primary[500],
          border: `1px solid ${theme.colors.primary[500]}`,
          '&:hover': {
            backgroundColor: theme.colors.primary[50],
          },
        } as React.CSSProperties;
      default:
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary[500],
          color: theme.colors.neutral.white,
          '&:hover': {
            backgroundColor: theme.colors.primary[600],
          },
        } as React.CSSProperties;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          fontSize: theme.typography.fontSize.sm,
          minHeight: '32px',
        } as React.CSSProperties;
      case 'lg':
        return {
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          fontSize: theme.typography.fontSize.lg,
          minHeight: '48px',
        } as React.CSSProperties;
      default:
        return {
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          fontSize: theme.typography.fontSize.base,
          minHeight: '40px',
        } as React.CSSProperties;
    }
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    fontFamily: theme.typography.fontFamily.sans.join(', '),
  } as React.CSSProperties;

  return (
    <Button
      {...buttonProps}
      style={buttonStyles}
      className={`fg-button fg-button-${variant} fg-button-${size} ${className}`}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

