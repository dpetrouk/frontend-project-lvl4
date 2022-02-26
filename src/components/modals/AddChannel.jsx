import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';

import getSchema from './getValidationSchema.js';
import { socket } from '../../socket.js';

const generateOnSubmit = ({ selectChannel, hideModal }, setIsSubmitDisabled) => (values) => {
  setIsSubmitDisabled(true);
  socket.emit('newChannel', { name: values.name }, (response) => {
    setIsSubmitDisabled(false);
    selectChannel(response.data.id);
    hideModal();
  });
};

export default (props) => {
  const { hideModal } = props;
  const [isInvalid, setIsInvalid] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

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
    onSubmit: generateOnSubmit(props, setIsSubmitDisabled),
    initialValues: { name: '' },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <Modal show centered backdrop onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label visuallyHidden>Имя канала</Form.Label>
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
            <Button type="submit" disabled={isSubmitDisabled}>Отправить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
