import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Row, Col, Nav, Button, InputGroup, FormControl, Dropdown,
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import cn from 'classnames';

import useAuth from '../hooks/index.jsx';
import { channelsSelectors } from '../slices/channelsSlice.js';
import { messagesSelectors } from '../slices/messagesSlice.js';
import fetchData from '../slices/fetchData.js';

import getModal from './modals/index.js';

const socket = io();

const renderAddChannelButton = ({ showModal }) => (
  <Button
    onClick={() => showModal('adding')}
    variant={null}
    className="p-0 text-primary btn btn-group-vertical"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
    <span className="visually-hidden">+</span>
  </Button>
);

const renderSendButton = () => (
  <Button
    type="submit"
    variant={null}
    className="btn-group-vertical"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-square" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
    </svg>
    <span className="visually-hidden">Отправить</span>
  </Button>
);

const renderChannels = ({
  channels, selectedChannelId, selectChannel, showModal,
}) => (
  channels.map(({ id, name, removable }) => {
    const renderChannelButton = () => {
      const generalClassNames = cn('w-100', 'rounded-0', 'text-start');
      const removableChannelClassNames = cn(generalClassNames, 'text-truncate');
      return (
        <Button
          onClick={selectChannel(id)}
          variant={id === selectedChannelId ? 'secondary' : null}
          className={removable ? removableChannelClassNames : generalClassNames}
          type="button"
        >
          <span className="me-1">#</span>
          {name}
        </Button>
      );
    };

    return (
      <Nav.Item as="li" key={id} className="w-100">
        {removable
          ? (
            <Dropdown className="d-flex btn-group">
              {renderChannelButton()}
              <Dropdown.Toggle
                split
                variant={id === selectedChannelId ? 'secondary' : null}
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => showModal('removing', { id })}>Удалить</Dropdown.Item>
                <Dropdown.Item onClick={() => showModal('renaming', { id, name })}>Переименовать</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )
          : renderChannelButton()}
      </Nav.Item>
    );
  })
);

const renderMessages = (messages) => messages.map(({ username, id, body }) => (
  <div key={id} className="text-break mb-2">
    <strong>{username}</strong>
    <span>: </span>
    {body}
  </div>
));

const renderMessageInput = ({
  message, handleMessageInput, sendMessage, messageInputRef,
}) => (
  <div className="mt-auto px-5 py-3">
    <form onSubmit={sendMessage} className="py-1 border rounded-2">
      <InputGroup>
        <FormControl
          onChange={handleMessageInput}
          value={message}
          ref={messageInputRef}
          placeholder="Введите сообщение..."
          aria-label="Новое сообщение"
          className="border-0 p-0 ps-2"
        />
        {renderSendButton()}
      </InputGroup>
    </form>
  </div>
);

const renderModal = ({ modalInfo, hideModal, setSelectedChannelId }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return (
    <Component
      modalInfo={modalInfo}
      onHide={hideModal}
      socket={socket}
      setSelectedChannelId={setSelectedChannelId}
    />
  );
};

const Home = () => {
  // console.log('Home');
  const dispatch = useDispatch();
  const { token, username } = useAuth();

  const messageInputRef = React.createRef(null);
  const focusOnMessageInput = () => {
    messageInputRef.current.focus();
  };

  const [message, setMessage] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState(1);
  const selectChannel = (id) => () => {
    setSelectedChannelId(id);
    focusOnMessageInput();
  };

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
    socket.on('removeChannel', () => {
      dispatchFetchData();
      setSelectedChannelId(1);
    });
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

  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col xs={4} md={2} className="border-end pt-5 px-0 bg-light">
            <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
              <span>Каналы</span>
              {renderAddChannelButton({ showModal })}
            </div>
            <Nav as="ul" variant="pills" fill className="flex-column px-2">
              {renderChannels({
                channels, selectedChannelId, selectChannel, showModal,
              })}
            </Nav>
          </Col>
          <Col className="p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b>
                    {`# ${selectedChannel?.name}`}
                  </b>
                </p>
                <span className="text-muted">{`${channelMessages.length} сообщ`}</span>
              </div>
              <div className="overflow-auto px-5">
                {renderMessages(channelMessages)}
              </div>
              {renderMessageInput({
                message, handleMessageInput, sendMessage, messageInputRef,
              })}
            </div>
          </Col>
        </Row>
      </Container>
      {renderModal({ modalInfo, hideModal, setSelectedChannelId })}
    </>
  );
};

export default Home;
