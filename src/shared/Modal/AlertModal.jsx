import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AlertModal({ show, onHide, title, bodyText, size = 'lg', closeButton = 1, timeout = false }) {

  useEffect(() => {
    if (timeout && show) setTimeout(() => {
      onHide();
    }, 1500);
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h4>{title}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {bodyText}
      </Modal.Body>
      {!!closeButton &&
        <Modal.Footer>
          <Button onClick={onHide}>Cerrar</Button>
        </Modal.Footer>
      }
    </Modal>
  );
}

export { AlertModal };