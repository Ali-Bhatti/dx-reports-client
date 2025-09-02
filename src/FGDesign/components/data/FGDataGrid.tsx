// import React from 'react';
// import { Grid, type GridProps } from '@progress/kendo-react-grid';
// import { useFGTheme } from '../../theme/useFGTheme';

// interface FGDataGridProps extends Omit<GridProps, 'children'> {
//   variant?: 'default' | 'bordered' | 'striped';
//   size?: 'sm' | 'md' | 'lg';
//   loading?: boolean;
//   emptyMessage?: string;
//   className?: string;
// }

// export const FGDataGrid: React.FC<FGDataGridProps> = ({
//   variant = 'default',
//   size = 'md',
//   loading = false,
//   emptyMessage = 'No data available',
//   className = '',
//   ...gridProps
// }) => {
//   const theme = useFGTheme();

//   const getVariantStyles = () => {
//     const baseStyles = {
//       border: `1px solid ${theme.colors.secondary[200]}`,
//       borderRadius: theme.borderRadius.lg,
//       overflow: 'hidden',
//       backgroundColor: theme.colors.neutral.white,
//     };

//     switch (variant) {
//       case 'bordered':
//         return {
//           ...baseStyles,
//           borderWidth: '2px',
//           borderColor: theme.colors.secondary[300],
//         };
//       case 'striped':
//         return {
//           ...baseStyles,
//           '& .k-grid-tbody tr:nth-child(even)': {
//             backgroundColor: theme.colors.secondary[50],
//           },
//         };
//       default:
//         return baseStyles;
//     }
//   };

//   const getSizeStyles = () => {
//     switch (size) {
//       case 'sm':
//         return {
//           fontSize: theme.typography.fontSize.sm,
//           '& .k-grid-header th': {
//             padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
//             fontSize: theme.typography.fontSize.xs,
//           },
//           '& .k-grid-tbody td': {
//             padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
//           },
//         };
//       case 'lg':
//         return {
//           fontSize: theme.typography.fontSize.lg,
//           '& .k-grid-header th': {
//             padding: `${theme.spacing.md} ${theme.spacing.lg}`,
//             fontSize: theme.typography.fontSize.base,
//           },
//           '& .k-grid-tbody td': {
//             padding: `${theme.spacing.md} ${theme.spacing.lg}`,
//           },
//         };
//       default:
//         return {
//           fontSize: theme.typography.fontSize.base,
//           '& .k-grid-header th': {
//             padding: `${theme.spacing.sm} ${theme.spacing.md}`,
//             fontSize: theme.typography.fontSize.sm,
//           },
//           '& .k-grid-tbody td': {
//             padding: `${theme.spacing.sm} ${theme.spacing.md}`,
//           },
//         };
//     }
//   };

//   const gridStyles = {
//     ...getVariantStyles(),
//     ...getSizeStyles(),
//     fontFamily: theme.typography.fontFamily.sans.join(', '),
//     '& .k-grid-header': {
//       backgroundColor: theme.colors.secondary[100],
//       borderBottom: `1px solid ${theme.colors.secondary[200]}`,
//     },
//     '& .k-grid-header th': {
//       fontWeight: theme.typography.fontWeight.semibold,
//       color: theme.colors.secondary[700],
//       borderRight: `1px solid ${theme.colors.secondary[200]}`,
//     },
//     '& .k-grid-tbody tr': {
//       borderBottom: `1px solid ${theme.colors.secondary[100]}`,
//       transition: theme.transitions.fast,
//     },
//     '& .k-grid-tbody tr:hover': {
//       backgroundColor: theme.colors.primary[50],
//     },
//     '& .k-grid-tbody td': {
//       borderRight: `1px solid ${theme.colors.secondary[100]}`,
//       color: theme.colors.secondary[800],
//     },
//     '& .k-grid-pager': {
//       backgroundColor: theme.colors.secondary[50],
//       borderTop: `1px solid ${theme.colors.secondary[200]}`,
//       padding: theme.spacing.sm,
//     },
//   };

//   return (
//     <div className={`fg-datagrid ${className}`}>
//       <Grid
//         {...gridProps}
//         style={gridStyles}
//         className="fg-datagrid-grid"
//       />
      
//       {loading && (
//         <div 
//           className="fg-datagrid-loading"
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             padding: theme.spacing.xl,
//             color: theme.colors.secondary[500],
//           }}
//         >
//           Loading...
//         </div>
//       )}
      
//       {!loading && (!gridProps.data || gridProps.data.length === 0) && (
//         <div 
//           className="fg-datagrid-empty"
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             padding: theme.spacing.xl,
//             color: theme.colors.secondary[500],
//             fontStyle: 'italic',
//           }}
//         >
//           {emptyMessage}
//         </div>
//       )}
//     </div>
//   );
// };
