// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import './localisation.js';
import { initProfanityFilter } from './profanityFilter.js';
import App from './components/App.jsx';
import store from './slices/index.js';
import { initSocket, socket } from './socket.js';
import {
  setCurrentChannel, addChannel, renameChannel, removeChannel,
} from './slices/channelsInfoSlice.js';
import { addMessage } from './slices/messagesInfoSlice.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

injectStyle();

initProfanityFilter();

const defaultChannelId = 1;

const isCurrentChannel = (id) => {
  const state = store.getState();
  const { currentChannelId } = state.channelsInfo;
  return currentChannelId === id;
};

initSocket();

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

const rollbarConfig = {
  accessToken: '77231179c88b48748f4207f5ca794629',
  environment: 'production',
};

const container = document.querySelector('#chat');

ReactDOM.render(
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </RollbarProvider>,
  container,
);

console.log('After rendering in index.jsx');
