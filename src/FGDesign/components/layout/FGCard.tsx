// import React, { ReactNode } from 'react';
// import { Card, CardProps } from '@progress/kendo-react-layout';
// import { useFGTheme } from '../../theme/useFGTheme';

// interface FGCardProps extends Omit<CardProps, 'children'> {
//   children: ReactNode;
//   variant?: 'default' | 'elevated' | 'outlined';
//   padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
//   className?: string;
// }

// export const FGCard: React.FC<FGCardProps> = ({
//   children,
//   variant = 'default',
//   padding = 'md',
//   className = '',
//   ...cardProps
// }) => {
//   const theme = useFGTheme();

//   const getVariantStyles = () => {
//     switch (variant) {
//       case 'elevated':
//         return {
//           boxShadow: theme.shadows.lg,
//           border: 'none',
//         };
//       case 'outlined':
//         return {
//           boxShadow: 'none',
//           border: `1px solid ${theme.colors.secondary[200]}`,
//         };
//       default:
//         return {
//           boxShadow: theme.shadows.base,
//           border: 'none',
//         };
//     }
//   };

//   const getPaddingStyles = () => {
//     switch (padding) {
//       case 'none':
//         return { padding: 0 };
//       case 'sm':
//         return { padding: theme.spacing.sm };
//       case 'md':
//         return { padding: theme.spacing.md };
//       case 'lg':
//         return { padding: theme.spacing.lg };
//       case 'xl':
//         return { padding: theme.spacing.xl };
//       default:
//         return { padding: theme.spacing.md };
//     }
//   };

//   const cardStyles = {
//     backgroundColor: theme.colors.neutral.white,
//     borderRadius: theme.borderRadius.lg,
//     transition: theme.transitions.normal,
//     ...getVariantStyles(),
//     ...getPaddingStyles(),
//   };

//   return (
//     <Card
//       {...cardProps}
//       style={cardStyles}
//       className={`fg-card ${className}`}
//     >
//       {children}
//     </Card>
//   );
// };
