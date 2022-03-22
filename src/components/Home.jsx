import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Row, Col, Nav, Button, InputGroup, FormControl, Dropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import { socket } from '../socket.js';
import useAuth from '../hooks/index.jsx';
import { setInitialState, setCurrentChannel } from '../slices/channelsInfoSlice.js';
import { openModal, closeModal } from '../slices/modalSlice.js';
import getModal from './modals/index.js';
import { profanityFilter } from '../profanityFilter.js';

const renderAddChannelButton = ({ showModal }) => (
  <Button
    onClick={() => showModal('addChannel')}
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

const renderSendButton = ({ isSendDisabled }) => {
  const { t } = useTranslation();
  return (
    <Button
      disabled={isSendDisabled}
      type="submit"
      variant={null}
      className="btn-group-vertical"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-square" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
      </svg>
      <span className="visually-hidden">{t('chat.send')}</span>
    </Button>
  );
};

const renderChannels = ({
  channels, currentChannelId, selectChannel, showModal,
}) => {
  const { t } = useTranslation();
  return channels.map(({ id, name, removable }) => {
    const renderChannelButton = () => {
      const generalClassNames = cn('w-100', 'rounded-0', 'text-start');
      const removableChannelClassNames = cn(generalClassNames, 'text-truncate');
      return (
        <Button
          onClick={() => selectChannel(id)}
          variant={id === currentChannelId ? 'secondary' : null}
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
                variant={id === currentChannelId ? 'secondary' : null}
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => showModal('removeChannel', { channelId: id })}>{t('chat.channel.remove')}</Dropdown.Item>
                <Dropdown.Item onClick={() => showModal('renameChannel', { channelId: id })}>{t('chat.channel.rename')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )
          : renderChannelButton()}
      </Nav.Item>
    );
  });
};

const renderMessages = (messages) => messages.map(({ username, id, body }) => (
  <div key={id} className="text-break mb-2">
    <strong>{username}</strong>
    <span>: </span>
    {profanityFilter.clean(body)}
  </div>
));

const renderMessageInput = ({
  message, handleMessageInput, sendMessage, messageInputRef, isSendDisabled,
}) => {
  const { t } = useTranslation();
  return (
    <div className="mt-auto px-5 py-3">
      <form onSubmit={sendMessage} className="py-1 border rounded-2">
        <InputGroup>
          <FormControl
            onChange={handleMessageInput}
            value={message}
            ref={messageInputRef}
            placeholder={t('chat.enterMessage')}
            aria-label={t('chat.newMessage')}
            className="border-0 p-0 ps-2"
          />
          {renderSendButton({ isSendDisabled })}
        </InputGroup>
      </form>
    </div>
  );
};

const renderModal = ({ modalInfo, hideModal, selectChannel }) => {
  if (!modalInfo.isOpened) {
    return null;
  }
  console.log({ modalInfo });

  const Component = getModal(modalInfo.type);
  return (
    <Component
      modalInfo={modalInfo}
      hideModal={hideModal}
      selectChannel={selectChannel}
    />
  );
};

const Home = () => {
  console.log('Home');
  const { t } = useTranslation();
  const { token, username } = useAuth();

  const dispatch = useDispatch();

  const selectChannel = (channelId) => {
    dispatch(setCurrentChannel({ channelId }));
  };

  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(setInitialState(token));
  }, []);

  const currentChannelId = useSelector((state) => state.channelsInfo.currentChannelId);
  const channels = useSelector((state) => state.channelsInfo.channels);
  const messages = useSelector((state) => state.messagesInfo.messages);
  console.log({ channels, messages });

  const currentChannel = channels.find(({ id }) => id === currentChannelId);
  const currentChannelMessages = messages.filter(({ channelId }) => channelId === currentChannelId);

  console.log({
    username, channels, currentChannel, currentChannelMessages, messages,
  });

  const [isSendDisabled, setIsSendDisabled] = useState(true);

  const sendMessage = (e) => {
    e.preventDefault();
    setIsSendDisabled(true);
    socket.emit('newMessage', { body: message, channelId: currentChannelId, username }, () => {
      setMessage('');
      setIsSendDisabled(false);
    });
  };

  const modalInfo = useSelector((state) => state.modal);
  const hideModal = () => dispatch(closeModal());
  const showModal = (type, extra = null) => dispatch(openModal({ type, extra }));

  const handleMessageInput = (e) => {
    setIsSendDisabled(e.target.value === '');
    setMessage(e.target.value);
  };

  const messageInputRef = React.createRef(null);
  useEffect(() => {
    messageInputRef.current.focus();
  });

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col xs={4} md={2} className="border-end pt-5 px-0 bg-light">
            <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
              <span>{t('chat.channels')}</span>
              {renderAddChannelButton({ showModal })}
            </div>
            <Nav as="ul" variant="pills" fill className="flex-column px-2">
              {renderChannels({
                channels, currentChannelId, selectChannel, showModal,
              })}
            </Nav>
          </Col>
          <Col className="p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b>
                    {`# ${currentChannel?.name}`}
                  </b>
                </p>
                <span className="text-muted">{t('chat.messages', { count: currentChannelMessages.length })}</span>
              </div>
              <div className="overflow-auto px-5">
                {renderMessages(currentChannelMessages)}
              </div>
              {renderMessageInput({
                message, handleMessageInput, sendMessage, messageInputRef, isSendDisabled,
              })}
            </div>
          </Col>
        </Row>
      </Container>
      {renderModal({ modalInfo, hideModal, selectChannel })}
    </>
  );
};

export default Home;
