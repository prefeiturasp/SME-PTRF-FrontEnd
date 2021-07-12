import React from "react";
import {ModalBootstrap} from "../../../Globais/ModalBootstrap";

export const ModalDeletarDespesa = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.onDeletarDespesas}
            primeiroBotaoTexto="Sim"
            primeiroBotaoCss="success"
            segundoBotaoOnclick={props.handleClose}
            segundoBotaoCss="outline-success"
            segundoBotaoTexto="Não"
        />
    )
};