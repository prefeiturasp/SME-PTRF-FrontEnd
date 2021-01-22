import React, {Fragment} from "react";
import {Modal} from "react-bootstrap";


export const ModalDesvincularLote = (propriedades) => {
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                         <div className="col-12" style={{paddingBottom:"20px"}}>
                            <strong>Você possui <span style={{color: "#00585E", fontWeight:"bold"}}>{propriedades.quantidadeSelecionada} {propriedades.quantidadeSelecionada === 1 ? "unidade" : "unidades"}</span> {propriedades.quantidadeSelecionada === 1 ? "selecionada" : "selecionadas"}</strong>
                         </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <button
                    onClick={(e) => propriedades.onHide()}
                    className="btn btn-outline-success mt-2"
                    type="button"
                >
                Cancelar
                </button>
                <button disabled={propriedades.tecnico !== "" ? false: true}
                    onClick={(e) => propriedades.primeiroBotaoOnclick()}
                    type="submit"
                    className="btn btn-success mt-2"
                >
                Desvincular
                </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};
