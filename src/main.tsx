import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './config/authConfig';


import 'devextreme/dist/css/dx.light.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.common.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.light.css';
import 'devexpress-reporting/dist/css/dx-webdocumentviewer.css';
import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/dreamweaver.css';
import 'ace-builds/css/theme/ambiance.css';
import '@devexpress/analytics-core/dist/css/dx-querybuilder.css';
import 'devexpress-reporting/dist/css/dx-reportdesigner.css';
import 'devexpress-richedit/dist/dx.richedit.css';

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
import { Provider } from 'react-redux';
import { store } from './app/store.ts'

const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL and handle redirect promises
msalInstance.initialize().then(() => {
  msalInstance.handleRedirectPromise().then((response) => {
    // Handle redirect response
    if (response) {
      console.log('Authentication successful:', response);
    }
  }).catch((error) => {
    console.error('Authentication error:', error);
  });

  // Render the app after MSAL is initialized
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MsalProvider>
    </StrictMode>,
  );
}).catch((error) => {
  console.error('MSAL initialization error:', error);
});

