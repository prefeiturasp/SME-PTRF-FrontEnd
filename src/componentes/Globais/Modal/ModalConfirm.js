import React from "react";
import {Modal} from "react-bootstrap";
import { openModal, closeModal } from "../../../store/reducers/componentes/Globais/Modal/actions";
import "./modal-bootstrap.scss"

export function ModalConfirm({
  dispatch,
  title,
  message,
  dataQa,
  cancelText = "Cancelar",
  onCancel,
  confirmText = "Confirmar",
  confirmButtonClass = "btn-success",
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
          <div dangerouslySetInnerHTML={{__html: message}}/>          
        </Modal.Body>
        <Modal.Footer>
            <button data-qa={dataQa ? `${dataQa}-btn-${cancelText}` : ""} 
                    onClick={handleClose}
                    className="btn btn-outline-success">
              {cancelText}
            </button>
            {onConfirm ? (
                <button data-qa={dataQa ? `${dataQa}-btn-${confirmText}` : ""} 
                        onClick={handleConfirm}
                        className={`btn ${confirmButtonClass} mt-2`}>
                  {confirmText}
                </button>
            ) : null} 
        </Modal.Footer>
        </>
      ),
    })
  );
}