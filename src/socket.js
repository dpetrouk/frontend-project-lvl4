import store from './slices/index.js';

import {
  addChannel, renameChannel, removeChannel,
} from './slices/channelsInfoSlice.js';
import { addMessage } from './slices/messagesInfoSlice.js';

let socket; // eslint-disable-line

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
  socket.on('removeChannel', (channel) => {
    store.dispatch(removeChannel(channel));
  });
};

const initSocket = (socketClient) => {
  socket = socketClient;

  initSocketHandlers();
};

const emit = {
  newMessage: (message, callback) => socket.emit('newMessage', message, callback),
  newChannel: (channel, callback) => socket.emit('newChannel', channel, callback),
  renameChannel: (renamedChannel, callback) => socket.emit('renameChannel', renamedChannel, callback),
  removeChannel: (removedChannel, callback) => socket.emit('removeChannel', removedChannel, callback),
};

export { initSocket, emit };
