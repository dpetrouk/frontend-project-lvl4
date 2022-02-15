import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';

const generateOnSubmit = ({ socket, setSelectedChannelId, onHide }) => (values) => {
  socket.emit('newChannel', { name: values.channelName }, (response) => {
    console.log({ response });
    setSelectedChannelId(response.data.id);
  });
  onHide();
};

export default (props) => {
  console.log('adding channel');
  const { onHide } = props;
  const f = useFormik({ onSubmit: generateOnSubmit(props), initialValues: { channelName: '' } });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show centered backdrop onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              ref={inputRef}
              required
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.channelName}
              name="channelName"
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button onClick={onHide} variant="secondary" className="me-2">Отменить</Button>
            <Button type="submit">Отправить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
