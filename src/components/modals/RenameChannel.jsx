import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { selectChannelById } from '../../slices/channelsInfoSlice.js';
import getSchema from './getValidationSchema.js';
import { emit } from '../../socket.js';

const RenameChannel = (props) => {
  const { t } = useTranslation();
  const { hideModal, modalInfo } = props;
  const { channelId } = modalInfo.extra;
  const channel = useSelector((state) => selectChannelById(state, channelId));

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

  const handleSubmit = (values) => {
    setIsSubmitDisabled(true);
    const renamedChannel = { id: modalInfo.extra.channelId, name: values.name };
    emit.renameChannel(renamedChannel, () => {
      setIsSubmitDisabled(false);
      hideModal();
      toast(t('chat.toasts.channelRenamed'));
    });
  };

  const f = useFormik({
    onSubmit: handleSubmit,
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

export default RenameChannel;
