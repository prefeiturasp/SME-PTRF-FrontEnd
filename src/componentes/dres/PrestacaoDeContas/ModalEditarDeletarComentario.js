import {ModalBootstrapFormComentarioDeAnalise} from "../../Globais/ModalBootstrap";
import React from "react";
export const ModalEditarDeletarComentario = (props) => {
    const bodyTextarea = () => {
        return (
            <>
                <div className='row'>

                    <div className="col-12 mt-2">
                        <textarea
                            name='resalvas'
                            value={props.comentario.comentario}
                            onChange={(e) => props.onChangeComentario(e.target.value, props.comentario)}
                            //onChange={props.onChangeComentario}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="d-flex bd-highlight mt-2">
                    <div className="p-Y flex-grow-1 bd-highlight">
                        <button onClick={()=>props.setShowModalDeleteComentario(true)} type="button" className="btn btn-danger mt-2"> Apagar</button>
                    </div>
                    <div className="p-Y bd-highlight">
                        <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    </div>
                    <div className="p-Y bd-highlight">
                        <button onClick={props.onEditarComentario} type="button" className="btn btn-success mt-2">Confirmar</button>
                    </div>
                </div>
            </>
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
