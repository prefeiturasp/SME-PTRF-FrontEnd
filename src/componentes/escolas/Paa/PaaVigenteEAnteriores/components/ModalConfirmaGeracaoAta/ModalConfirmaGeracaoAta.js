import { memo } from "react";
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const ModalConfirmaGeracaoAta = memo(({ open, onClose, onConfirm }) => {
    return (
        <Modal
            centered
            show={open}
            onHide={onClose}
        >
            <Modal.Header>
                <Modal.Title>Confirmar geração da Ata</Modal.Title>
                <button
                    type="button"
                    className="close"
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Ao gerar a Ata de Apresentação, não será mais possível editá-la. Deseja continuar?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={onClose}>
                    Cancelar
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={onConfirm}>
                    Confirmar
                </button>
            </Modal.Footer>
        </Modal>
    );
});

