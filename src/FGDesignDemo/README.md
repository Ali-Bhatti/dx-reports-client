# FGDesign Demo

This folder contains a small showcase for the in-progress FGDesign system.

## Quick usage

```tsx
import { FGThemeProvider, FGButton } from '../FGDesign';

export const Example = () => (
  <FGThemeProvider>
    <FGButton variant="primary">Click me</FGButton>
  </FGThemeProvider>
);
```

To view the full demo page, import and render `DemoPage` in your application:

```tsx
import DemoPage from './FGDesignDemo/DemoPage';

<DemoPage />;
```

