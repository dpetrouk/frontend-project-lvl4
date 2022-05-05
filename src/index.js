// @ts-check

import { io as socketClient } from 'socket.io-client';

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';

import init from './init.jsx';

export default () => init(socketClient);
