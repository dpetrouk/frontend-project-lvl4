// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import App from './components/App.jsx';
import store from './slices/index.js';
import { initSocket } from './socket.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const container = document.querySelector('#chat');

initSocket();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
);

console.log('After rendering in index.jsx');
