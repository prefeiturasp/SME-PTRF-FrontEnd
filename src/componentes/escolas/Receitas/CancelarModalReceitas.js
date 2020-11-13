import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const CancelarModalReceitas = (propriedades) =>{
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo={propriedades.uuid ? 'Deseja cancelar as alterações feitas no crédito?' :'Deseja cancelar a inclusão de crédito?'}
            bodyText=""
            primeiroBotaoOnclick={propriedades.onCancelarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};