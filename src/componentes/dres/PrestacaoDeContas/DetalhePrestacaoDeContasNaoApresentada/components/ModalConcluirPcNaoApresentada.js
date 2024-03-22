import React from "react";
import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";

export const ModalConcluirPcNaoApresentada = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.onConcluirPcNaoApresentada}
            segundoBotaoCss={props.segundoBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
            dataQa="modal-concluir-pc-nao-apresentada"
        />
    )
};