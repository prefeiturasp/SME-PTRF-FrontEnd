import { memo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const ModalRetificarPAA = memo(({ open, onClose, onConfirm, paaData, statusDocumento }) => {
  const [justificativa, setJustificativa] = useState("");

  useEffect(() => {
    if(open) setJustificativa("");

  }, [open])

  return (
    <Modal centered show={open} onHide={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Retificar o PAA</Modal.Title>
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
        {paaData ?
        <p>
          {statusDocumento?.mensagem}
          <br />
          Deseja prosseguir com a retificação?
        </p>
        : null}
        <p>
          Caso deseje prosseguir, justifique o motivo da retificação abaixo:
          <br />
          <textarea
            name="justificativa"
            value={justificativa}
            rows={3}
            onChange={(e) => setJustificativa(e.target.value)}
            className="form-control mt-2"
            placeholder="Digite a justificativa aqui"
          />
        </p>
      </Modal.Body>
      <Modal.Footer id="main">
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onConfirm}
          disabled={justificativa === ""}
        >
          Retificar
        </button>
      </Modal.Footer>
    </Modal>
  );
});
