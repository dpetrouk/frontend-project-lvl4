import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import getSchema from './getValidationSchema.js';

const generateOnSubmit = ({ socket, modalInfo, onHide }) => (values) => {
  socket.emit('renameChannel', { id: modalInfo.item.id, name: values.name });
  onHide();
};

export default (props) => {
  const { onHide, modalInfo } = props;

  const [isInvalid, setIsInvalid] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

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
    initialValues: { name: modalInfo.item.name },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <Modal show centered backdrop onHide={onHide}>
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
            <Button onClick={onHide} variant="secondary" className="me-2">Отменить</Button>
            <Button type="submit">Отправить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
