import ReactDOM from 'react-dom';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { injectStyle as injectStyleForToaster } from 'react-toastify/dist/inject-style';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import App from './components/App.jsx';
import store from './slices/index.js';
import { initSocket, socket } from './socket.js';
import {
  setCurrentChannel, addChannel, renameChannel, removeChannel,
} from './slices/channelsInfoSlice.js';
import { addMessage } from './slices/messagesInfoSlice.js';

import { initLocalisation } from './localisation.js';
import { initProfanityFilter } from './profanityFilter.js';

const defaultChannelId = 1;

const rollbarConfig = {
  accessToken: '77231179c88b48748f4207f5ca794629',
  environment: process.env.NODE_ENV,
};

const isCurrentChannel = (id) => {
  const state = store.getState();
  const { currentChannelId } = state.channelsInfo;
  return currentChannelId === id;
};

const initSocketHandlers = () => {
  socket.on('newMessage', (messageWithId) => {
    store.dispatch(addMessage(messageWithId));
  });
  socket.on('newChannel', (channelWithId) => {
    store.dispatch(addChannel(channelWithId));
  });
  socket.on('renameChannel', (channel) => {
    store.dispatch(renameChannel(channel));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(removeChannel({ id }));
    if (isCurrentChannel(id)) {
      store.dispatch(setCurrentChannel({ channelId: defaultChannelId }));
    }
  });
};

const init = async () => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  initSocket();

  initSocketHandlers();

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
