import store from './slices/index.js';
import {
  setCurrentChannel, addChannel, renameChannel, removeChannel,
} from './slices/channelsInfoSlice.js';
import { addMessage } from './slices/messagesInfoSlice.js';

let socket;

const defaultChannelId = 1;

const isCurrentChannel = (id) => {
  const state = store.getState();
  const { currentChannelId } = state.channelsInfo;
  return currentChannelId === id;
};

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
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(removeChannel({ id }));
    if (isCurrentChannel(id)) {
      store.dispatch(setCurrentChannel({ channelId: defaultChannelId }));
    }
  });
};

const initSocket = (socketClient) => {
  socket = socketClient();

  initSocketHandlers();
};

export { socket, initSocket };
