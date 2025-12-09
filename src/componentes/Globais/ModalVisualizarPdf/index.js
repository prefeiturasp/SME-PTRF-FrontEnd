import React from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './ModalVisualizarPdf.scss';

export const ModalVisualizarPdf = ({ show, onHide, url, titulo, iframeTitle = "PDF" }) => {
  return (
    <Modal
      centered
      show={show}
      onHide={onHide}
      className="modal-visualizar-pdf"
      dialogClassName="modal-visualizar-pdf-dialog"
    >
      <Modal.Header>
        <Modal.Title>
          {titulo || 'Visualizar PDF'}
        </Modal.Title>
        <button
          type="button"
          className="close"
          onClick={onHide}
          aria-label="Fechar"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </Modal.Header>
      <Modal.Body>
        {url ? (
          <div style={{ height: '80vh' }}>
            <iframe
              src={url}
              title={iframeTitle}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <div className="text-danger">Não foi possível carregar o PDF.</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

