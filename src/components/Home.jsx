import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import useAuth from '../hooks/index.jsx';
import { addChannel, channelsSelectors } from '../slices/channelsSlice.js';
import { addMessage, messagesSelectors } from '../slices/messagesSlice.js';
import fetchData from '../slices/fetchData.js';

const renderChannels = (channels) => channels.map(({ id, name }) => (
  <li key={id}>{name}</li>
));

const renderMessages = (messages) => messages.map(({ username, id, body }) => (
  <div key={id}>
    <strong>{username}</strong>
    <span>: </span>
    {body}
  </div>
));

const Home = () => {
  // console.log('Home');
  const dispatch = useDispatch();
  const { token, username } = useAuth();
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const dispatchFetchData = () => dispatch(fetchData(token));
    dispatchFetchData();
    socketRef.current = io('ws://localhost:5000'); // ?
    socketRef.current.on('connect', () => {
      console.log('socket: connect');
    });
    socketRef.current.on('newMessage', () => {
      dispatchFetchData();
      setMessage('');
    });
    socketRef.current.on('newChannel', dispatchFetchData);
    socketRef.current.on('removeChannel', dispatchFetchData);
    socketRef.current.on('renameChannel', dispatchFetchData);
  }, []);

  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);
  // console.log({ username, channels, messages });

  const handleMessageInput = (e) => setMessage(e.target.value);

  const sendMessage = (e) => {
    e.preventDefault();
    socketRef.current.emit('newMessage', { username, body: message });
  };

  return (
    <div className="container">
      <div className="row">
        <h2>
          Home
        </h2>
        <div className="col">
          <div>Каналы</div>
          <ul>{renderChannels(channels)}</ul>
        </div>
        <div className="col">
          <div></div>
          <div>{renderMessages(messages)}</div>
          <div>
            <form onSubmit={sendMessage}>
              <input
                onChange={handleMessageInput}
                value={message}
              />
              <button>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
