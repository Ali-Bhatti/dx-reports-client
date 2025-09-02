// import React, { createContext, useContext, type ReactNode } from 'react';
// import { FGColors, FGSpacing, FGTypography, FGBorderRadius, FGShadows, FGTransitions } from '../utils/designTokens';

// // Theme Context
// interface FGThemeContextType {
//   colors: typeof FGColors;
//   spacing: typeof FGSpacing;
//   typography: typeof FGTypography;
//   borderRadius: typeof FGBorderRadius;
//   shadows: typeof FGShadows;
//   transitions: typeof FGTransitions;
// }

// const FGThemeContext = createContext<FGThemeContextType | undefined>(undefined);

// // Theme Provider Props
// interface FGThemeProviderProps {
//   children: ReactNode;
//   theme?: Partial<FGThemeContextType>;
// }

// export const FGThemeProvider: React.FC<FGThemeProviderProps> = ({ 
//   children, 
//   theme 
// }) => {
//   const defaultTheme: FGThemeContextType = {
//     colors: FGColors,
//     spacing: FGSpacing,
//     typography: FGTypography,
//     borderRadius: FGBorderRadius,
//     shadows: FGShadows,
//     transitions: FGTransitions,
//   };

//   const mergedTheme = theme ? { ...defaultTheme, ...theme } : defaultTheme;

//   return (
//     <FGThemeContext.Provider value={mergedTheme}>
//       {children}
//     </FGThemeContext.Provider>
//   );
// };

// // Hook to use theme
// export const useFGTheme = (): FGThemeContextType => {
//   const context = useContext(FGThemeContext);
//   if (!context) {
//     throw new Error('useFGTheme must be used within an FGThemeProvider');
//   }
//   return context;
// };
