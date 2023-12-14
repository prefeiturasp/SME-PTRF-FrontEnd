import React from "react";
import {Button, Modal} from "react-bootstrap";
import "./modal-antdesign.scss"

export const ModalAlterarSEI = (propriedades) => {
    return(
    <>
        <Modal centered
            show={
                propriedades.show
            }
            onHide={
                propriedades.onHide
        }>
            <Modal.Header>
                <Modal.Title>{
                    propriedades.titulo
                }</Modal.Title>
            </Modal.Header>
            <Modal.Body> {
                <>
                    <p>
                        <strong>O processo SEI foi alterado. O que você deseja fazer?</strong>
                    </p>

                    <div className="d-flex justify-content-center mt-3">
                        <Button className="w-100" variant="success" onClick={() => {
                        propriedades.receberPrestacaoDeContas()
                        }}>Manter o número do processo SEI existente</Button>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <Button className="w-100" variant="success" onClick={() => {
                            propriedades.receberPrestacaoDeContas('editar')
                        }}>Atualizar o número do processo SEI existente</Button>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <Button className="w-100" variant="success" onClick={() => {
                            propriedades.receberPrestacaoDeContas('incluir')
                        }}>Incluir um novo número de processo SEI</Button>
                    </div>
                </>
            } </Modal.Body>
            <Modal.Footer>
                <Button 
                    className={propriedades.primeiroBotaoClassName}
                    onClick={propriedades.primeiroBotaoOnClick}
                >
                    {propriedades.primeiroBotaoTexto} 
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    )
}