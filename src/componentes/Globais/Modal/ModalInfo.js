import React from "react";
import {Button, Modal} from "react-bootstrap";
import { openModal, closeModal } from "../../../store/reducers/componentes/Globais/Modal/actions";
import "./modal-bootstrap.scss"

export function ModalInfo({
  dispatch,
  title,
  message,
  dataQa,
  cancelText = "Fechar",
  onCancel,
}) {


  function handleClose() {
    if (onCancel) {
      onCancel();
    }
    
    dispatch(closeModal());
  }

  return dispatch(
    openModal({
      children: (
        <>
        <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message}
        </Modal.Body>
        <Modal.Footer>
            <Button 
              data-qa={dataQa ? `${dataQa}-btn-${cancelText}` : ""} 
              onClick={handleClose}
              className="btn btn-outline-success"
            >
              {cancelText}
            </Button>
        </Modal.Footer>
        </>
      ),
    })
  );
}