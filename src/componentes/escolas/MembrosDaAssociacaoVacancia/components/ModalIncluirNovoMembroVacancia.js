import React from "react";
import { Modal } from "react-bootstrap";

// Exibido após confirmar a saída de um ocupante, mesmo comportamento da v1
// (`perguntarIncluirNovoMembro`): pergunta se o cargo, agora vago, já deve
// receber um novo membro ou se o usuário volta para a listagem.
export const ModalIncluirNovoMembroVacancia = ({
    show = false,
    handleClose,
    handleConfirm,
}) => {
    return (
        <Modal show={show} onHide={handleClose} className="ModalIncluirNovoMembroVacancia">
            <Modal.Header>
                <Modal.Title>Importante</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Deseja incluir um novo membro para o cargo?
            </Modal.Body>
            <Modal.Footer>
                <button onClick={handleClose} className="btn btn-outline-success">
                    Não incluir
                </button>
                <button onClick={handleConfirm} className="btn btn-success mt-2">
                    Incluir novo membro
                </button>
            </Modal.Footer>
        </Modal>
    );
};
