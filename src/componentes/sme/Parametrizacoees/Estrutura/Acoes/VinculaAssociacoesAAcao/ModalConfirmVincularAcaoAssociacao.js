import {ModalBootstrap} from "../../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalConfirmVincularAcaoAssociacao = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.onDeleteAcaoTrue}
            segundoBotaoCss={props.segundoBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
        />
    )
};