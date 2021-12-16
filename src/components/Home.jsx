import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useAuth from '../hooks/index.jsx';
import { addChannel, channelsSelectors } from '../slices/channelsSlice.js';
import { addMessage, messagesSelectors } from '../slices/messagesSlice.js';
import fetchData from '../slices/fetchData.js';

const renderChannels = (channels) => channels.map(({ id, name }) => (
  <li key={id}>{name}</li>
));

const renderMessages = (messages) => messages.map(({ id, name }) => (
  <div key={id}>{name}</div>
));

const Home = () => {
  console.log('Home');
  const dispatch = useDispatch();
  const { token } = useAuth();
  useEffect(() => dispatch(fetchData(token)), []);
  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);
  console.log({ channels, messages });

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
            <form>
              <input />
              <button>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
