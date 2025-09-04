import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'devextreme/dist/css/dx.light.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.common.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.light.css';
import 'devexpress-reporting/dist/css/dx-reportdesigner.css';
import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/dreamweaver.css';
import '@progress/kendo-theme-default/dist/all.css';
import './styles/index.css';
import './styles/kendo-overrides.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

