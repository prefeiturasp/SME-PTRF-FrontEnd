import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalDeletarReceita = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo="Exclusão de Crédito"
            bodyText={props.texto}
            primeiroBotaoOnclick={props.onDeletarTrue}
            primeiroBotaoTexto="Excluir"
            primeiroBotaoCss="success"
            segundoBotaoOnclick={props.handleClose}
            segundoBotaoTexto="Cancelar"
            segundoBotaoCss="danger"
        />
    )
};