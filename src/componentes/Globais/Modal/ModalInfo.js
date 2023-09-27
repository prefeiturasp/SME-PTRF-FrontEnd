import React from "react";
import {Button, Modal} from "react-bootstrap";
import { openModal, closeModal } from "../../../store/reducers/componentes/Globais/Modal/actions";

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
            <Button data-qa={dataQa ? `${dataQa}-btn-${cancelText}` : ""} variant="secondary" onClick={handleClose}>
              {cancelText}
            </Button>
        </Modal.Footer>
        </>
      ),
    })
  );
}