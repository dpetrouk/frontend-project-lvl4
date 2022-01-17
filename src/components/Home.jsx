import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import cn from 'classnames';

import useAuth from '../hooks/index.jsx';
import { addChannel, channelsSelectors } from '../slices/channelsSlice.js';
import { addMessage, messagesSelectors } from '../slices/messagesSlice.js';
import fetchData from '../slices/fetchData.js';

const socket = io();

const renderChannels = (channels, selectedChannelId, selectChannel) => {
  const channelClassNames = cn('w-100', 'rounded-0', 'text-start', 'btn');
  const selectedChannelClassNames = cn(channelClassNames, {
    'btn-secondary': true,
  });
  return channels.map(({ id, name }) => (
    <li key={id} className="nav-item w-100">
      <button onClick={selectChannel(id)} type="button" className={id === selectedChannelId ? selectedChannelClassNames : channelClassNames}>
        <span className="me-1">#</span>
        {name}
      </button>
    </li>
  ));
};

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
  const [selectedChannelId, setSelectedChannelId] = useState(1);
  const selectChannel = (id) => () => setSelectedChannelId(id);

  useEffect(() => {
    const dispatchFetchData = () => dispatch(fetchData(token));
    console.log('Before dispatching');
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

  const selectedChannel = channels.find(({ id }) => id === selectedChannelId);
  const channelMessages = messages.filter(({ channelId }) => channelId === selectedChannelId);
  console.log({ username, channels, selectedChannel, channelMessages, messages });

  const handleMessageInput = (e) => setMessage(e.target.value);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('newMessage', { username, body: message, channelId: selectedChannelId });
  };

  return (
    <div className="container">
      <div className="row">
        <h2>
          Home
        </h2>
        <div className="col">
          <div>Каналы</div>
          <ul>{renderChannels(channels, selectedChannelId, selectChannel)}</ul>
        </div>
        <div className="col">
          <div>
            <p className="m-0">
              <b>
                {`# ${selectedChannel?.name}`}
              </b>
            </p>
            <span className="text-muted">{`${channelMessages.length} сообщ`}</span>
          </div>
          <div>{renderMessages(channelMessages)}</div>
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
