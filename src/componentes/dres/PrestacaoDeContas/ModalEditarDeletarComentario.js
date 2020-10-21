import {ModalBootstrapFormComentarioDeAnalise} from "../../Globais/ModalBootstrap";
import React from "react";

export const ModalEditarDeletarComentario = (props) => {

    //console.log("Props ", props)

    const bodyTextarea = () => {
        return (

                <div className='row'>

                    <div className="col-12 mt-2">
                        <label htmlFor="resalvas">Motivos:</label>
                        <textarea
                            name='resalvas'
                            value={props.comentario.comentario}
                            onChange={(e) => props.onChangeComentario(e.target.value)}
                            //onChange={props.onChangeComentario}
                            className="form-control"
                        />
                    </div>



                    <div className='col-12'>
                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                            <button
                                onClick={props.onEditarComentario}
                                type="button"
                                className="btn btn-success mt-2"
                            >
                                Confirmar
                            </button>

                            <button
                                onClick={props.onDeletarComentario}
                                type="button"
                                className="btn btn-danger mt-2"
                            >
                                DELETAR
                            </button>
                        </div>
                    </div>

                </div>

        )
    };

    return (
        <ModalBootstrapFormComentarioDeAnalise
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
