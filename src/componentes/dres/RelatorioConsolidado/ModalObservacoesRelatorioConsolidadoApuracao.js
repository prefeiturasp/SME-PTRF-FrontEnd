import {ModalFormComentariosRelatorioConsolidadoApuracao} from "../../Globais/ModalBootstrap";
import React from "react";
export const ModalObservacoesRelatorioConsolidadoApuracao = (props) => {
    const bodyTextarea = () => {
        return (
            <>
                <div className='row'>
                    <div className="col-12 mt-2">
                        <p><strong>Escreva um comentário para essa declaração</strong></p>
                        <textarea
                            name='resalvas'
                            value={props.observacao.observacao}
                            onChange={(e) => props.onChangeObservacao(e.target.value)}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="d-flex bd-highlight mt-2">
                    <div className="p-Y flex-grow-1 bd-highlight">
                        {props.observacao.observacao &&
                            <button onClick={()=>props.serviceObservacao({operacao:'deletar'})} type="button" className="btn btn-danger mt-2"> Excluir</button>
                        }
                    </div>
                    <div className="p-Y bd-highlight">
                        <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    </div>
                    <div className="p-Y bd-highlight">
                        <button disabled={!props.observacao.observacao} onClick={()=>props.serviceObservacao({operacao:'salvar'})} type="button" className="btn btn-success mt-2">Salvar</button>
                    </div>
                </div>
            </>
        )
    };

    return (
        <ModalFormComentariosRelatorioConsolidadoApuracao
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};