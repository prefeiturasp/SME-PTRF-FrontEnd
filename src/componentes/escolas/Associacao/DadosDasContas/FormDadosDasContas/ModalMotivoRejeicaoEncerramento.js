import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalMotivoRejeicaoEncerramento = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.bodyText}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
        />
    )
};