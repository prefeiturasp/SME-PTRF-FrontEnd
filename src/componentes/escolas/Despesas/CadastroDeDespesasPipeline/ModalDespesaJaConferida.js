import React from "react";
import {ModalBootstrap} from "../../../Globais/ModalBootstrap";

export const ModalDespesaConferida = (props) =>{
    return (
        <ModalBootstrap
            dataQa="modal-despesa-conferida"
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