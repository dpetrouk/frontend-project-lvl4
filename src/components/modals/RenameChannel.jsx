import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import getSchema from './getValidationSchema.js';
import { socket } from '../../socket.js';

const generateOnSubmit = ({ modalInfo, hideModal }, setIsSubmitDisabled, t) => (values) => {
  setIsSubmitDisabled(true);
  socket.emit('renameChannel', { id: modalInfo.extra.channelId, name: values.name }, () => {
    setIsSubmitDisabled(false);
    hideModal();
    toast(t('chat.toasts.channelRenamed'));
  });
};

export default (props) => {
  const { t } = useTranslation();
  const { hideModal, modalInfo } = props;
  const { channelId } = modalInfo.extra;
  const channels = useSelector((state) => state.channelsInfo.channels);
  const channel = channels.find(({ id }) => id === channelId);

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
    onSubmit: generateOnSubmit(props, setIsSubmitDisabled, t),
    initialValues: { name: channel.name },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <Modal show centered backdrop onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.modals.renameChannel')}</Modal.Title>
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
            <Button onClick={hideModal} variant="secondary" className="me-2">{t('chat.modals.cancel')}</Button>
            <Button type="submit" disabled={isSubmitDisabled}>{t('chat.modals.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
