import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const CancelarModalReceitas = (propriedades) =>{
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Deseja cancelar a inclusão de Crédito?"
            bodyText=""
            primeiroBotaoOnclick={propriedades.onCancelarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};