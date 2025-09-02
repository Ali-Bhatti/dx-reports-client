# FGDesign - Fleet GO Design System

A comprehensive design system built on top of KendoUI components, providing consistent styling and behavior across the Fleet GO Web Report Designer application.

## 🎨 Design Philosophy

FGDesign follows these core principles:
- **Consistency**: All components follow the same design patterns
- **Accessibility**: Built with accessibility in mind
- **Customization**: Easy to customize while maintaining consistency
- **Performance**: Lightweight and optimized
- **Developer Experience**: Type-safe and well-documented

## 📁 Folder Structure

```
src/FGDesign/
├── components/           # Core design system components
│   ├── layout/          # Layout components (Card, Container, GridLayout)
│   ├── forms/           # Form components (Textbox, Dropdown, Button, etc.)
│   ├── data/            # Data display components (DataGrid, DataTable, etc.)
│   ├── navigation/      # Navigation components (Header, Breadcrumb, Sidebar)
│   └── feedback/        # Feedback components (Modal, Toast, LoadingSpinner)
├── theme/               # Theme configuration and provider
├── utils/               # Utility functions and design tokens
├── hooks/               # Custom hooks
└── index.ts             # Main export file
```

## 🎯 Core Components

### Layout Components
- **FGCard**: Container component with variants (default, elevated, outlined)
- **FGContainer**: Layout wrapper with responsive behavior
- **FGGridLayout**: Grid-based layout system

### Form Components
- **FGTextbox**: Text input with validation states
- **FGDropdown**: Dropdown/select component
- **FGButton**: Button with multiple variants and sizes
- **FGCheckbox**: Checkbox component
- **FGSearchBox**: Search input with icon

### Data Components
- **FGDataGrid**: Data grid with sorting, filtering, pagination
- **FGDataTable**: Simple table component
- **FGStatisticsCard**: Statistics display cards
- **FGInfoBox**: Information display component

### Navigation Components
- **FGHeader**: Application header
- **FGBreadcrumb**: Breadcrumb navigation
- **FGSidebar**: Sidebar navigation

### Feedback Components
- **FGModal**: Modal dialog component
- **FGToast**: Toast notification component
- **FGLoadingSpinner**: Loading indicator

## 🎨 Design Tokens

### Colors
```typescript
import { FGColors } from '@fgdesign/utils/designTokens';

// Primary colors (Fleet GO Blue)
FGColors.primary[500] // #3b82f6

// Semantic colors
FGColors.success[500] // #22c55e
FGColors.warning[500] // #f59e0b
FGColors.error[500]   // #ef4444
```

### Spacing
```typescript
import { FGSpacing } from '@fgdesign/utils/designTokens';

FGSpacing.xs   // 0.25rem (4px)
FGSpacing.sm   // 0.5rem  (8px)
FGSpacing.md   // 1rem    (16px)
FGSpacing.lg   // 1.5rem  (24px)
FGSpacing.xl   // 2rem    (32px)
```

### Typography
```typescript
import { FGTypography } from '@fgdesign/utils/designTokens';

FGTypography.fontSize.xs    // 0.75rem (12px)
FGTypography.fontSize.sm    // 0.875rem (14px)
FGTypography.fontSize.base  // 1rem (16px)
FGTypography.fontSize.lg    // 1.125rem (18px)
```

## 🚀 Getting Started

### 1. Setup Theme Provider

Wrap your app with the FGThemeProvider:

```tsx
import { FGThemeProvider } from '@fgdesign/theme/FGThemeProvider';

function App() {
  return (
    <FGThemeProvider>
      <YourApp />
    </FGThemeProvider>
  );
}
```

### 2. Use Components

```tsx
import { FGCard, FGButton, FGTextbox } from '@fgdesign';

function MyComponent() {
  return (
    <FGCard variant="elevated" padding="lg">
      <FGTextbox 
        label="Email"
        placeholder="Enter your email"
        variant="outlined"
      />
      <FGButton variant="primary" size="lg">
        Submit
      </FGButton>
    </FGCard>
  );
}
```

### 3. Customize Theme

```tsx
import { FGThemeProvider } from '@fgdesign/theme/FGThemeProvider';

const customTheme = {
  colors: {
    primary: {
      500: '#your-custom-blue',
      // ... other colors
    }
  }
};

<FGThemeProvider theme={customTheme}>
  <YourApp />
</FGThemeProvider>
```

## 🎨 Component Variants

### FGCard Variants
- `default`: Standard card with subtle shadow
- `elevated`: Card with prominent shadow
- `outlined`: Card with border only

### FGButton Variants
- `primary`: Primary action button (blue)
- `secondary`: Secondary action button (gray)
- `success`: Success action button (green)
- `warning`: Warning action button (yellow)
- `error`: Error action button (red)
- `ghost`: Ghost button with border

### FGTextbox Variants
- `default`: Standard input
- `filled`: Input with filled background
- `outlined`: Input with prominent border

## 📱 Responsive Design

All components are built with responsive design in mind. Use the theme's spacing and typography tokens for consistent responsive behavior.

## ♿ Accessibility

Components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## 🔧 Customization

### Extending Components

```tsx
import { FGCard } from '@fgdesign';

// Extend with custom props
interface CustomCardProps extends FGCardProps {
  customProp?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ customProp, ...props }) => {
  return <FGCard {...props} className={`custom-card ${props.className}`} />;
};
```

### Custom Theme

```tsx
const customTheme = {
  colors: {
    primary: {
      500: '#your-brand-color',
    },
    // Override other tokens
  },
  spacing: {
    // Custom spacing values
  }
};
```

## 📚 Best Practices

1. **Use Design Tokens**: Always use theme tokens instead of hardcoded values
2. **Consistent Spacing**: Use the spacing scale for consistent layouts
3. **Semantic Colors**: Use semantic color variants (success, warning, error)
4. **Accessibility**: Always provide proper labels and ARIA attributes
5. **Responsive**: Design for mobile-first approach
6. **Performance**: Use React.memo for expensive components

## 🤝 Contributing

When adding new components to FGDesign:

1. Follow the existing naming convention (FG prefix)
2. Use the theme system for styling
3. Include TypeScript interfaces
4. Add proper documentation
5. Include accessibility features
6. Add unit tests
7. Update this README

## 📄 License

This design system is part of the Fleet GO Web Report Designer project.
