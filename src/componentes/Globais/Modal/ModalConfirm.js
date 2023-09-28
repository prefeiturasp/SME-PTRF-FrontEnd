import React from "react";
import {Button, Modal} from "react-bootstrap";
import { openModal, closeModal } from "../../../store/reducers/componentes/Globais/Modal/actions";

export function ModalConfirm({
  dispatch,
  title,
  message,
  dataQa,
  cancelText = "Cancelar",
  onCancel,
  confirmText = "Confirmar",
  onConfirm,
}) {


  function handleClose() {
    if (onCancel) {
      onCancel();
    }
    
    dispatch(closeModal());
  }

  function handleConfirm() {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
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
            {onConfirm ? (
                <Button data-qa={dataQa ? `${dataQa}-btn-${confirmText}` : ""} variant="primary" onClick={handleConfirm}>
                  {confirmText}
                </Button>
            ) : null} 
        </Modal.Footer>
        </>
      ),
    })
  );
}