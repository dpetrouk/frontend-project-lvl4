// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

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

const container = document.querySelector('#chat');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
);

console.log('After rendering in index.jsx');
