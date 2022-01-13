import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import useAuth from '../hooks/index.jsx';
import { addChannel, channelsSelectors } from '../slices/channelsSlice.js';
import { addMessage, messagesSelectors } from '../slices/messagesSlice.js';
import fetchData from '../slices/fetchData.js';

const socket = io();

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

  useEffect(() => {
    const dispatchFetchData = () => dispatch(fetchData(token));
    dispatchFetchData();
    socket.on('connect', () => {
      console.log('socket: connect');
    });
    socket.on('newMessage', () => {
      dispatchFetchData();
      setMessage('');
    });
    socket.on('newChannel', dispatchFetchData);
    socket.on('removeChannel', dispatchFetchData);
    socket.on('renameChannel', dispatchFetchData);
  }, []);

  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);
  // console.log({ username, channels, messages });

  const handleMessageInput = (e) => setMessage(e.target.value);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('newMessage', { username, body: message });
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
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
