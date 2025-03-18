import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmModal = ({ show, onHide, title, bodyText, size = 'lg', onConfirm, loadingReq }) => {
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
                <p>
                    {bodyText}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={onHide}>Cerrar</Button>
                <Button className='confirmButton' disabled={loadingReq} onClick={onConfirm}>
                    {loadingReq? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : 'Confirmar'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmModal;