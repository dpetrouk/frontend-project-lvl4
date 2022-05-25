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

export { socket, initSocket };
