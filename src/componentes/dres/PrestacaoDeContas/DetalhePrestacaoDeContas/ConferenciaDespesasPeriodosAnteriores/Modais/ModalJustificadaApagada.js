import {ModalBootstrap} from "../../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalJustificadaApagada = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.primeiroBotaoOnclick}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.handleClose}
            segundoBotaoTexto={props.segundoBotaoTexto}
            segundoBotaoCss={props.segundoBotaoCss}
        />
    )
};