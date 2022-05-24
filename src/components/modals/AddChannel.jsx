import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import getSchema from './getValidationSchema.js';
import { socket } from '../../socket.js';

const generateOnSubmit = ({ selectChannel, hideModal }, setIsSubmitDisabled, t) => (values) => {
  setIsSubmitDisabled(true);
  socket.emit('newChannel', { name: values.name }, (response) => {
    setIsSubmitDisabled(false);
    selectChannel(response.data.id);
    hideModal();
    toast(t('chat.toasts.channelAdded'));
  });
};

const AddChannel = (props) => {
  const { t } = useTranslation();
  const { hideModal } = props;
  const [isInvalid, setIsInvalid] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  });

  const schema = getSchema();

  const validate = async ({ name }) => {
    const errors = {};
    setIsInvalid(false);
    await schema.validate(name)
      .catch((err) => {
        errors.name = err.message;
        inputRef.current.focus();
        setIsInvalid(true);
      });
    return errors;
  };

  const f = useFormik({
    onSubmit: generateOnSubmit(props, setIsSubmitDisabled, t),
    initialValues: { name: '' },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <Modal show centered backdrop onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.modals.addChannel')}</Modal.Title>
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
              id="name"
            />
            <Form.Label visuallyHidden htmlFor="name">{t('chat.modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {t(f.errors.name)}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button onClick={hideModal} variant="secondary" className="me-2">{t('chat.modals.cancel')}</Button>
            <Button type="submit" disabled={isSubmitDisabled}>{t('chat.modals.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
