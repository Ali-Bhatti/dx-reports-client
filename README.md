# DX Reports Client

React + TypeScript app built with Vite. Provides a reporting dashboard and designer using DevExpress Reporting and Kendo UI components, with state managed by Redux Toolkit and routing via React Router.

## Tech Stack
- React 19, TypeScript, Vite 7
- Redux Toolkit, React Router
- DevExpress Reporting (`devexpress-reporting`, `devexpress-reporting-react`)
- Kendo UI for React (Grid, Inputs, Buttons, Layout, Notifications)
- Tailwind CSS

## Quick Start
1. Install Node.js ≥ 18
2. Install deps: `npm install`
3. Start dev server: `npm run dev`
4. Build for production: `npm run build`
5. Preview build: `npm run preview`
6. Lint: `npm run lint`

## Project Structure
```
src/
  app/           # store setup and typed hooks
  components/    # UI components (dashboard, reports, modals, shared, table)
  features/      # Redux slices (reports, notifications)
  hooks/         # feature hooks
  pages/         # route pages (Dashboard, ReportDesigner)
  routes/        # router setup
  services/      # API clients (e.g., report.ts)
  style/         # tokens and Kendo overrides
  types/         # shared TypeScript types
  utils/         # helpers (e.g., dateFormatters)
```

## Scripts
- dev: start Vite dev server
- build: type-check and bundle
- preview: preview production build
- lint: run eslint

## Notes
- Kendo UI and DevExpress packages may require valid licenses.
