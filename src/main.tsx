import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'devextreme/dist/css/dx.light.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.common.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.light.css';
import 'devexpress-reporting/dist/css/dx-reportdesigner.css';
import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/dreamweaver.css';
import '@progress/kendo-theme-default/dist/all.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.tsx';
import './style/tokens.css';
import './index.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './style/kendo-override.css'
import { StoreProvider } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
)
