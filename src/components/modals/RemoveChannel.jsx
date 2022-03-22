import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { socket } from '../../socket.js';

const generateOnSubmit = ({ modalInfo, hideModal }, setIsSubmitDisabled, t) => (e) => {
  e.preventDefault();
  setIsSubmitDisabled(true);
  socket.emit('removeChannel', { id: modalInfo.extra.channelId }, () => {
    setIsSubmitDisabled(false);
    hideModal();
    toast(t('chat.toasts.channelRemoved'));
  });
};

export default (props) => {
  console.log('removing channel');
  const { t } = useTranslation();
  const { hideModal } = props;
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const onSubmit = generateOnSubmit(props, setIsSubmitDisabled, t);

  return (
    <Modal show centered backdrop onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <p className="lead">Уверены?</p>
          <div className="d-flex justify-content-end">
            <Button onClick={hideModal} variant="secondary" className="me-2">{t('chat.modals.cancel')}</Button>
            <Button type="submit" variant="danger" disabled={isSubmitDisabled}>{t('chat.modals.remove')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
