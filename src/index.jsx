// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const container = document.querySelector('#chat');

ReactDOM.render(
  <App />,
  container,
);

console.log('After rendering in index.jsx');
