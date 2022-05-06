// @ts-check
import ReactDOM from 'react-dom';
import { io as socketClient } from 'socket.io-client';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';

import init from './init.jsx';

const runApp = async () => {
  const container = document.querySelector('#chat');

  const app = await init(socketClient());

  ReactDOM.render(
    app,
    container,
  );
};

runApp();
