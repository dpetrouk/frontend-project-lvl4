import { io } from 'socket.io-client';

let socket;

const initSocket = () => {
  socket = io();
};

export { socket, initSocket };
