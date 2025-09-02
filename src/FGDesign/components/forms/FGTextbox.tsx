// import React, { forwardRef } from 'react';
// import { TextBox, TextBoxProps } from '@progress/kendo-react-inputs';
// import { useFGTheme } from '../../theme/useFGTheme';

// interface FGTextboxProps extends Omit<TextBoxProps, 'ref'> {
//   variant?: 'default' | 'filled' | 'outlined';
//   size?: 'sm' | 'md' | 'lg';
//   error?: boolean;
//   helperText?: string;
//   label?: string;
//   className?: string;
// }

// export const FGTextbox = forwardRef<HTMLInputElement, FGTextboxProps>(({
//   variant = 'default',
//   size = 'md',
//   error = false,
//   helperText,
//   label,
//   className = '',
//   ...textBoxProps
// }, ref) => {
//   const theme = useFGTheme();

//   const getVariantStyles = () => {
//     const baseStyles = {
//       border: `1px solid ${error ? theme.colors.error[500] : theme.colors.secondary[300]}`,
//       borderRadius: theme.borderRadius.md,
//       transition: theme.transitions.normal,
//       fontFamily: theme.typography.fontFamily.sans.join(', '),
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
//         };
//       case 'lg':
//         return {
//           padding: `${theme.spacing.md} ${theme.spacing.lg}`,
//           fontSize: theme.typography.fontSize.lg,
//         };
//       default:
//         return {
//           padding: `${theme.spacing.sm} ${theme.spacing.md}`,
//           fontSize: theme.typography.fontSize.base,
//         };
//     }
//   };

//   const inputStyles = {
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
//     <div className={`fg-textbox ${className}`}>
//       {label && (
//         <label 
//           className="fg-textbox-label"
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
      
//       <TextBox
//         ref={ref}
//         {...textBoxProps}
//         style={inputStyles}
//         className={`fg-textbox-input ${error ? 'fg-textbox-error' : ''}`}
//       />
      
//       {helperText && (
//         <div 
//           className="fg-textbox-helper"
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

// FGTextbox.displayName = 'FGTextbox';
