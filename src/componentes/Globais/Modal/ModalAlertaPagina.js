import React from "react";
import {Button, Modal} from "react-bootstrap";
import DOMPurify from 'dompurify';
import { openModal, closeModal } from "../../../store/reducers/componentes/Globais/Modal/actions";
import "./modal-bootstrap.scss"

export function ModalAlertaPagina({
  dispatch,
  titulo = 'Aviso',
  textoHtml,
  dataQa,
  onFechar,
}) {
  const textoSeguro = DOMPurify.sanitize(textoHtml ?? '');

  function handleFechar() {
    if (onFechar) {
      onFechar();
    }
    
    dispatch(closeModal());
  }



  return dispatch(
    openModal({
      backdrop: "static",
      keyboard: false,
      children: (
        <>
          <Modal.Header>
            <Modal.Title>{titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div dangerouslySetInnerHTML={{ __html: textoSeguro }} />
          </Modal.Body>
          <Modal.Footer>
            <Button 
              data-qa={dataQa ? `${dataQa}-btn-fechar` : ''} 
              onClick={handleFechar}
              className="btn btn-outline-success"
            >
              Entendi
            </Button>
          </Modal.Footer>
        </>
      ),
    })
  );
}