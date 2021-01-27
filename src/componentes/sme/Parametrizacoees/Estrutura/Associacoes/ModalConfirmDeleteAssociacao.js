import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalConfirmDeleteAssociacao = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.onDeleteAssociacaoTrue}
            segundoBotaoCss={props.segundoBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
        />
    )
};