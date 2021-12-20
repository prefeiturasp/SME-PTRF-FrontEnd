import React from "react";
import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";

export const ModalConfirmaApagarMotivoNaoRegularidade = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo={propriedades.titulo}
            bodyText={`<p>${propriedades.texto}</p>`}
            primeiroBotaoOnclick={propriedades.primeiroBotaoOnclick}
            primeiroBotaoCss={propriedades.primeiroBotaoCss}
            primeiroBotaoTexto={propriedades.primeiroBotaoTexto }
            segundoBotaoOnclick={propriedades.segundoBotaoOnclick}
            segundoBotaoCss={propriedades.segundoBotaoCss}
            segundoBotaoTexto={propriedades.segundoBotaoTexto}
        />
    )
};