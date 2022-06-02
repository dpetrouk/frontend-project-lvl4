import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { injectStyle as injectStyleForToaster } from 'react-toastify/dist/inject-style';
import Rollbar from 'rollbar';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import App from './components/App.jsx';
import store from './slices/index.js';
import { initSocket } from './socket.js';
import { initLocalisation } from './localisation.js';
import { initProfanityFilter } from './profanityFilter.js';

const defaultLanguage = 'ru';

const init = (socketClient) => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  if (!process.env.ROLLBAR_ACCESS_TOKEN) {
    console.log('No ROLLBAR_ACCESS_TOKEN');
  }

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN || 'no token',
    environment: process.env.NODE_ENV,
  };

  initSocket(socketClient);

  initLocalisation(defaultLanguage);

  initProfanityFilter();

  injectStyleForToaster();

  const rollbar = new Rollbar(rollbarConfig);

  return (
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
