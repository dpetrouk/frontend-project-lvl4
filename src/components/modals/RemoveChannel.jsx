import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

import { socket } from '../../socket.js';

const generateOnSubmit = ({ modalInfo, hideModal }, setIsSubmitDisabled) => (e) => {
  e.preventDefault();
  setIsSubmitDisabled(true);
  socket.emit('removeChannel', { id: modalInfo.extra.channelId }, () => {
    setIsSubmitDisabled(false);
    hideModal();
  });
};

export default (props) => {
  console.log('removing channel');
  const { hideModal } = props;
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const onSubmit = generateOnSubmit(props, setIsSubmitDisabled);

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
            <Button type="submit" variant="danger" disabled={isSubmitDisabled}>Удалить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
