import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';

import getSchema from './getValidationSchema.js';
import { socket } from '../../socket.js';

const generateOnSubmit = ({ modalInfo, hideModal }) => (values) => {
  socket.emit('renameChannel', { id: modalInfo.extra.channelId, name: values.name });
  hideModal();
};

export default (props) => {
  const { hideModal, modalInfo } = props;
  const { channelId } = modalInfo.extra;
  const channels = useSelector((state) => state.channelsInfo.channels);
  const channel = channels.find(({ id }) => id === channelId);

  const [isInvalid, setIsInvalid] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  });

  const schema = getSchema();

  const validate = ({ name }) => {
    const errors = {};
    schema.validate(name)
      .catch((err) => {
        errors.name = err.message;
        inputRef.current.focus();
        setIsInvalid(true);
      });
    return errors;
  };

  const f = useFormik({
    onSubmit: generateOnSubmit(props),
    initialValues: { name: channel.name },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <Modal show centered backdrop onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Control
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              required
              isInvalid={isInvalid}
              name="name"
            />
            <Form.Control.Feedback type="invalid">
              {f.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button onClick={hideModal} variant="secondary" className="me-2">Отменить</Button>
            <Button type="submit">Отправить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
