import React, {Fragment} from "react";
import {DatePickerField} from "../../Globais/DatePickerField";
import {Modal} from "react-bootstrap";


export const ModalPrevia = (propriedades) => {
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                         <div className="col-12" style={{paddingBottom:"20px"}}>
                            Selecione qual a data final para a geração do referido documento
                         </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-6">
                            <label htmlFor="data_inicio">Data Inicial</label>
                            <DatePickerField
                                name="data_inicio"
                                id="data_inicio"
                                value={propriedades.data_inicio !== null ? propriedades.data_inicio : ""}
                                //onChange={(e) => e}
                                disabled
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="data_fim">Data final</label>
                            <DatePickerField
                                name="data_fim"
                                id="data_fim"
                                value={propriedades.data_fim !== null ? propriedades.data_fim : ""}
                                onChange={propriedades.handleChange}
                            />
                            {propriedades.mensagemErro !== "" && <span className="span_erro text-danger mt-1"> {propriedades.mensagemErro}</span>}
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
                <button 
                    onClick={(e) => propriedades.primeiroBotaoOnclick()}
                    type="submit"
                    className="btn btn-success mt-2"
                >
                Gerar Prévia
                </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}