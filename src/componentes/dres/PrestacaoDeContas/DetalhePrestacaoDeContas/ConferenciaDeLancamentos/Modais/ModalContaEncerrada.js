import {ModalBootstrap} from "../../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalContaEncerrada = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            size='lg'
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.primeiroBotaoOnclick}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.segundoBotaoOnclick}
            segundoBotaoTexto={props.segundoBotaoTexto}
            segundoBotaoCss={props.segundoBotaoCss}
        />
    )
};