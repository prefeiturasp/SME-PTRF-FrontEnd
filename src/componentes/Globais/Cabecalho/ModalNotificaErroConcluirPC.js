import React from "react";
import {ModalBootstrap} from "../ModalBootstrap";

export const ModalNotificaErroConcluirPC = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={props.irParaConcluirPc}
            segundoBotaoCss="success"
            segundoBotaoTexto="Ir para concluir"
        />
    )
};