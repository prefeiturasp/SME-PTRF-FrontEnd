import React from "react";
import {ModalBootstrap} from "../../../Globais/ModalBootstrap";

export const ModalValorReceitaDespesaDiferente = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.onSalvarValoresDiferentes}
            primeiroBotaoTexto="Sim"
            primeiroBotaoCss="success"
            segundoBotaoOnclick={props.handleClose}
            segundoBotaoCss="outline-success"
            segundoBotaoTexto="Não"
        />
    )
};