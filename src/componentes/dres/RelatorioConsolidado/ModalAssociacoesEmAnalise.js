import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalAssociacoesEmAnalise = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={props.onGerarRelatorio}
            segundoBotaoCss="success"
            segundoBotaoTexto="Relatório parcial"
        />
    )
};