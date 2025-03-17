import React from "react";
import { Button } from "react-bootstrap";
import {
  openModal,
  closeModal,
} from "../../../store/reducers/componentes/Globais/Modal/actions";
import IconeConfirmacao from "../../../assets/img/icone-modal-confirmacao.svg";
import IconeAvisoVermelho from "../../../assets/img/icone-modal-aviso-vermelho.svg";
import IconeClose from "../../../assets/img/icone-close.svg";
import "./modal-bootstrap.scss";
import "./custom-modal.scss";

export function CustomModalConfirm({
  dispatch,
  title,
  message,
  dataQa,
  isDanger = false,
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
        <div
          className="row text-center d-flex align-items-center justify-content-center"
          style={{ padding: "10% 15%" }}
        >
          <div className="w-100 d-flex justify-content-end">
            <button onClick={handleClose} className="btn p-0">
              <img src={IconeClose} alt="IconeClose" className="img-fluid" />
            </button>
          </div>
          <div className="flex w-100">
            <img
              src={isDanger ? IconeAvisoVermelho : IconeConfirmacao}
              alt="IconeConfirmacao"
              className="img-fluid mb-3"
            />
          </div>
          <h4
            className="custom-modal-title"
            data-qa={dataQa ? `titulo-${dataQa}` : ""}
          >
            {title}
          </h4>
          <p
            className="custom-modal-message"
            data-qa={dataQa ? `mensagem-${dataQa}` : ""}
          >
            {message}
          </p>
          <div className="col-12 mt-3 d-flex justify-content-center">
            <Button
              onClick={handleClose}
              className="btn-success"
              data-qa={dataQa ? `btn-${cancelText}-${dataQa}` : ""}
            >
              {cancelText}
            </Button>
            {onConfirm ? (
              <Button
                onClick={handleConfirm}
                className={`${
                  isDanger ? "btn btn-danger ml-2" : "btn btn-success ml-2"
                }`}
                data-qa={dataQa ? `btn-${confirmText}-${dataQa}` : ""}
              >
                {confirmText}
              </Button>
            ) : null}
          </div>
        </div>
      ),
    })
  );
}
