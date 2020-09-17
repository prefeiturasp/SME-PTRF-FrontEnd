import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalConcluirPeriodo = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="danger"
            segundoBotaoOnclick={props.onSalvarTrue}
            segundoBotaoCss="success"
            segundoBotaoTexto="Confirmo"
        />
    )
};