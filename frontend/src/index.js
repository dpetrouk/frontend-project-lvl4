// @ts-check
import ReactDOM from 'react-dom';
import { io as socketClient } from 'socket.io-client';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';

import init from './init.jsx';

const runApp = () => {
  const container = document.querySelector('#chat');

  const InitiatedApp = init(socketClient());

  ReactDOM.render(
    InitiatedApp,
    container,
  );
};

runApp();
