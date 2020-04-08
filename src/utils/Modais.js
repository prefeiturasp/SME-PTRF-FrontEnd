import React, {Component, Fragment} from "react";
import {Button, Modal} from "react-bootstrap";

export const AvisoCapitalModal = (propriedades) =>{
    return(
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.handleClose}>
                <Modal.Header>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>A relação de bens de capital é a mesma utilizada no Sistema de Bens Patrimoniais Móveis (SBPM) da Prefeitura de São Paulo e, portanto, nem todos os itens podem ser adquiridos com os recursos do PTRF.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={propriedades.handleClose}>
                        Estou Ciente
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export const CancelarModal = (propriedades) => {

        return (
            <Fragment>
                <Modal centered show={propriedades.show} onHide={propriedades.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cancelar cadastro</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Tem certeza que deseja cancelar esse cadastramento? As informações não serão salvas</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={propriedades.onCancelarTrue}>
                            OK
                        </Button>
                        <Button variant="primary" onClick={propriedades.handleClose}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
}

export const DeletarModal = (propriedades)=> {

        return (
            <Fragment>
                <Modal centered show={propriedades.show} onHide={propriedades.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Deseja excluir esta Despesa?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Tem certeza que deseja excluir esta despesa? A ação não poderá ser desfeita.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={propriedades.onDeletarTrue}>
                            OK
                        </Button>
                        <Button variant="primary" onClick={propriedades.handleClose}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )

}
