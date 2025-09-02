// import React, { forwardRef } from 'react';
// import { DropDownList, type DropDownListProps } from '@progress/kendo-react-dropdowns';
// import { useFGTheme } from '../../theme/useFGTheme';

// interface FGDropdownProps extends Omit<DropDownListProps, 'ref'> {
//   variant?: 'default' | 'filled' | 'outlined';
//   size?: 'sm' | 'md' | 'lg';
//   error?: boolean;
//   helperText?: string;
//   label?: string;
//   placeholder?: string;
//   className?: string;
// }

// export const FGDropdown = forwardRef<HTMLInputElement, FGDropdownProps>(({
//   variant = 'default',
//   size = 'md',
//   error = false,
//   helperText,
//   label,
//   placeholder,
//   className = '',
//   ...dropDownProps
// }, ref) => {
//   const theme = useFGTheme();

//   const getVariantStyles = () => {
//     const baseStyles = {
//       border: `1px solid ${error ? theme.colors.error[500] : theme.colors.secondary[300]}`,
//       borderRadius: theme.borderRadius.md,
//       transition: theme.transitions.normal,
//       fontFamily: theme.typography.fontFamily.sans.join(', '),
//       backgroundColor: theme.colors.neutral.white,
//     };

//     switch (variant) {
//       case 'filled':
//         return {
//           ...baseStyles,
//           backgroundColor: theme.colors.secondary[50],
//           borderColor: error ? theme.colors.error[500] : theme.colors.secondary[200],
//         };
//       case 'outlined':
//         return {
//           ...baseStyles,
//           backgroundColor: 'transparent',
//           borderWidth: '2px',
//         };
//       default:
//         return baseStyles;
//     }
//   };

//   const getSizeStyles = () => {
//     switch (size) {
//       case 'sm':
//         return {
//           padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
//           fontSize: theme.typography.fontSize.sm,
//           minHeight: '32px',
//         };
//       case 'lg':
//         return {
//           padding: `${theme.spacing.md} ${theme.spacing.lg}`,
//           fontSize: theme.typography.fontSize.lg,
//           minHeight: '48px',
//         };
//       default:
//         return {
//           padding: `${theme.spacing.sm} ${theme.spacing.md}`,
//           fontSize: theme.typography.fontSize.base,
//           minHeight: '40px',
//         };
//     }
//   };

//   const dropdownStyles = {
//     ...getVariantStyles(),
//     ...getSizeStyles(),
//     '&:focus': {
//       outline: 'none',
//       borderColor: theme.colors.primary[500],
//       boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`,
//     },
//     '&:hover': {
//       borderColor: error ? theme.colors.error[600] : theme.colors.secondary[400],
//     },
//   };

//   return (
//     <div className={`fg-dropdown ${className}`}>
//       {label && (
//         <label 
//           className="fg-dropdown-label"
//           style={{
//             display: 'block',
//             marginBottom: theme.spacing.xs,
//             fontSize: theme.typography.fontSize.sm,
//             fontWeight: theme.typography.fontWeight.medium,
//             color: theme.colors.secondary[700],
//           }}
//         >
//           {label}
//         </label>
//       )}
      
//       <DropDownList
//         ref={ref}
//         {...dropDownProps}
//         style={dropdownStyles}
//         className={`fg-dropdown-input ${error ? 'fg-dropdown-error' : ''}`}
//         placeholder={placeholder}
//       />
      
//       {helperText && (
//         <div 
//           className="fg-dropdown-helper"
//           style={{
//             marginTop: theme.spacing.xs,
//             fontSize: theme.typography.fontSize.xs,
//             color: error ? theme.colors.error[600] : theme.colors.secondary[500],
//           }}
//         >
//           {helperText}
//         </div>
//       )}
//     </div>
//   );
// });

// FGDropdown.displayName = 'FGDropdown';
