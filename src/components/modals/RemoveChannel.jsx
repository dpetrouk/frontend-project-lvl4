import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { emit } from '../../socket.js';

const RemoveChannel = (props) => {
  const { t } = useTranslation();
  const { hideModal, modalInfo } = props;
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitDisabled(true);
    const removedChannel = { id: modalInfo.extra.channelId };
    emit.removeChannel(removedChannel, () => {
      setIsSubmitDisabled(false);
      hideModal();
      toast(t('chat.toasts.channelRemoved'));
    });
  };

  return (
    <Modal show centered backdrop onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <p className="lead">{t('chat.modals.confirm')}</p>
          <div className="d-flex justify-content-end">
            <Button onClick={hideModal} variant="secondary" className="me-2">{t('chat.modals.cancel')}</Button>
            <Button type="submit" variant="danger" disabled={isSubmitDisabled}>{t('chat.modals.remove')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
