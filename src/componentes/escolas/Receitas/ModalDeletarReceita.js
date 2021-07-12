import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalDeletarReceita = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo="Deseja excluir este Crédito?"
            bodyText={props.texto}
            primeiroBotaoOnclick={props.onDeletarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={props.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};