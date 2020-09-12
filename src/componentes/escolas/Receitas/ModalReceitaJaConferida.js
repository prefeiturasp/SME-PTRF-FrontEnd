import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalReceitaConferida = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="Não, cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={props.onSalvarDespesaConferida}
            segundoBotaoCss="success"
            segundoBotaoTexto="Gravar"
        />
    )
};