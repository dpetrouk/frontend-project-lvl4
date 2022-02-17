import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { channelsSelectors } from '../../slices/channelsSlice.js';

const generateOnSubmit = ({ socket, setSelectedChannelId, onHide }) => (values) => {
  socket.emit('newChannel', { name: values.name }, (response) => {
    setSelectedChannelId(response.data.id);
  });
  onHide();
};

export default (props) => {
  const { onHide } = props;

  const [isInvalid, setIsInvalid] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name); // Может лучше через селектор?

  const schema = yup.string().min(3).notOneOf(channelsNames);
  const validate = ({ name }) => {
    const errors = {};
    schema.validate(name)
      .catch((err) => {
        errors.name = err.message;
        setIsInvalid(true);
        inputRef.current.focus();
      });
    return errors;
  };

  const f = useFormik({
    onSubmit: generateOnSubmit(props),
    initialValues: { name: '' },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <Modal show centered backdrop onHide={onHide}>
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
              id="name"
              className="mb-2"
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
