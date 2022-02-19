import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const generateOnSubmit = ({ socket, modalInfo, onHide }) => (e) => {
  e.preventDefault();
  socket.emit('removeChannel', { id: modalInfo.item.id });
  onHide();
};

export default (props) => {
  console.log('removing channel');
  const { onHide } = props;
  const onSubmit = generateOnSubmit(props);

  return (
    <Modal show centered backdrop onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <p className="lead">Уверены?</p>
          <div className="d-flex justify-content-end">
            <Button onClick={onHide} variant="secondary" className="me-2">Отменить</Button>
            <Button type="submit" variant="danger">Удалить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
