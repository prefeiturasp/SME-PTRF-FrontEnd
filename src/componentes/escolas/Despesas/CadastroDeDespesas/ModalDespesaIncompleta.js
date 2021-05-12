import React from "react";
import {ModalBootstrap} from "../../../Globais/ModalBootstrap";

export const ModalDespesaIncompleta = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="Sim"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={props.onSalvarDespesaIncompleta}
            segundoBotaoCss="success"
            segundoBotaoTexto="Não"
        />
    )
};