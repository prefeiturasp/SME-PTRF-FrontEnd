import {ModalFormComentariosRelatorioConsolidadoApuracao} from "../../Globais/ModalBootstrap";
import React from "react";
export const ModalComentariosRelatorioConsolidadoApuracao = (props) => {
    //console.log("MODAL ", props)
    const bodyTextarea = () => {
        return (
            <>
                <div className='row'>

                    <div className="col-12 mt-2">
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
                            <button onClick={props.onDeletarObeservacao} type="button" className="btn btn-danger mt-2"> Apagar</button>
                        }
                    </div>
                    <div className="p-Y bd-highlight">
                        <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    </div>
                    <div className="p-Y bd-highlight">
                        <button disabled={!props.observacao.observacao} onClick={props.onSalvarObservacao} type="button" className="btn btn-success mt-2">Salvar</button>
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
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.onVoltarParaAnalise}
            segundoBotaoCss={props.segundoBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
        />
    )
};