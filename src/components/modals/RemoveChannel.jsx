import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

import { socket } from '../../socket.js';

const generateOnSubmit = ({ modalInfo, hideModal }) => (e) => {
  e.preventDefault();
  socket.emit('removeChannel', { id: modalInfo.extra.channelId });
  hideModal();
};

export default (props) => {
  console.log('removing channel');
  const { hideModal } = props;
  const onSubmit = generateOnSubmit(props);

  return (
    <Modal show centered backdrop onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <p className="lead">Уверены?</p>
          <div className="d-flex justify-content-end">
            <Button onClick={hideModal} variant="secondary" className="me-2">Отменить</Button>
            <Button type="submit" variant="danger">Удалить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
