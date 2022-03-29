import ReactDOM from 'react-dom';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { injectStyle as injectStyleForToaster } from 'react-toastify/dist/inject-style';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import App from './components/App.jsx';
import store from './slices/index.js';
import { initSocket } from './socket.js';
import { initLocalisation } from './localisation.js';
import { initProfanityFilter } from './profanityFilter.js';

const rollbarConfig = {
  accessToken: '77231179c88b48748f4207f5ca794629',
  environment: process.env.NODE_ENV,
};

const init = async (socketClient) => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  initSocket(socketClient);

  initLocalisation();

  initProfanityFilter();

  injectStyleForToaster();

  const container = document.querySelector('#chat');

  ReactDOM.render(
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>,
    container,
  );
};

export default init;
