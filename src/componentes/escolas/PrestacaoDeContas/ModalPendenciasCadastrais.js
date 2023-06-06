import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalPendenciasCadastrais = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            size={props.size}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.segundoBotaoOnclick}
            segundoBotaoCss={props.segundoBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
            bodyActions={props.bodyActions}
        />
    )
};