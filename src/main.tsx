import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import App from './App.tsx'
import 'devextreme/dist/css/dx.light.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.common.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.light.css';
import 'devexpress-reporting/dist/css/dx-reportdesigner.css';
import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/dreamweaver.css';
import '@progress/kendo-theme-default/dist/all.css';
import Table from './Table.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Table counterHeaderText="This is a Counter with prop"/>
  </StrictMode>,
)
