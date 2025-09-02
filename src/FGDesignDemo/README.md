# FGDesign Demo

This folder contains a small showcase application for the in-progress FGDesign system.

## Quick usage

Navigate to `/fg-demo` in the app to view the component demos. The sidebar lists the available components and each route renders a small example.

You can also use the components directly in your own pages:

```tsx
import { FGThemeProvider, FGButton } from '../FGDesign';

export const Example = () => (
  <FGThemeProvider>
    <FGButton variant="primary">Click me</FGButton>
  </FGThemeProvider>
);
```

