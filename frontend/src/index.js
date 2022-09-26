import './assets/application.scss';

import ReactDOM from 'react-dom/client';
import { io as socketClient } from 'socket.io-client';

import init from './init.jsx';

const runApp = () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));

  const InitiatedApp = init(socketClient());

  root.render(InitiatedApp);
};

runApp();
