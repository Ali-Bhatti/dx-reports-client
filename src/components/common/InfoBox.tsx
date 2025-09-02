// import React from 'react';

// interface InfoBoxProps {
//   message: string;
//   type?: 'info' | 'warning' | 'success' | 'error';
//   className?: string;
// }

// export const InfoBox: React.FC<InfoBoxProps> = ({
//   message,
//   type = 'info',
//   className = ''
// }) => {
//   const getStyles = () => {
//     switch (type) {
//       case 'warning':
//         return 'bg-yellow-50 border-yellow-200 text-yellow-800';
//       case 'success':
//         return 'bg-green-50 border-green-200 text-green-800';
//       case 'error':
//         return 'bg-red-50 border-red-200 text-red-800';
//       default:
//         return 'bg-blue-50 border-blue-200 text-blue-800';
//     }
//   };

//   return (
//     <div className={`p-4 border rounded-lg ${getStyles()} ${className}`}>
//       <p className="text-sm">{message}</p>
//     </div>
//   );
// };
