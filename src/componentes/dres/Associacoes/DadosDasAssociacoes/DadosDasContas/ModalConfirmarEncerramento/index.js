import {ModalBootstrap} from "../../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalConfirmarEncerramento = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.onConfirmarEncerramento}
            segundoBotaoTexto={props.segundoBotaoTexto}
            segundoBotaoCss={props.segundoBotaoCss}
        />
    )
};
