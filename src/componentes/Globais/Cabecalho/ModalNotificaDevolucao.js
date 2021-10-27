import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalNotificaDevolucao = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.onVerAcertosDepois}
            primeiroBotaoTexto="Ver depois"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={props.onVerAcertos}
            segundoBotaoCss="success"
            segundoBotaoTexto="Ver acertos"
        />
    )
};