import React, {Fragment} from "react";
import {Modal} from "react-bootstrap";


export const ModalAtribuir = (propriedades) => {
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
                    <div className="row">
                    <div className="form-group col-12">
                            <label htmlFor="tecnico">Novo técnico responsável</label>
                            <select 
                                    onChange={(e) => propriedades.selecionarTecnico(e.target.value)} 
                                    name="tecnico"
                                    id="tecnico" 
                                    className="form-control"
                                    >
                                <option key={0} value="">Selecione uma opção</option>
                                {propriedades.tecnicosList && propriedades.tecnicosList.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
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
                Atribuir
                </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export const ModalConfirmarRetiradaAtribuicoes = (propriedades) => {
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                         <div className="col-12" style={{paddingBottom:"20px"}}>
                            <strong>Você deseja retirar as atribuições selecionadas?</strong>
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
                Confirmar
                </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export const ModalInformativoCopiaPeriodo = (propriedades) => {
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                         <div className="col-12" style={{paddingBottom:"20px"}}>
                            <p><strong>Atribuições copiadas do período {propriedades.periodo !== null ? `${propriedades.periodo.referencia}` : ""}</strong></p>
                            <p><strong>As atribuições que foram copiadas podem ser alteradas normalmente.</strong></p>
                         </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <button
                    onClick={(e) => propriedades.onHide()}
                    className="btn btn-success mt-2"
                    type="button"
                >
                OK
                </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}
