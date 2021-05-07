import {ModalBootstrap} from "../ModalBootstrap";
import React from "react";

export const ModalUsuarioNaoCadastrado = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.onCadastrarTrue}
            segundoBotaoCss={props.segundoBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
        />
    )
};