import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalConcluirPeriodo = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.onConcluir}
            primeiroBotaoDisabled={props.confirmando}
            primeiroBotaoTexto="Confirmar"
            primeiroBotaoCss="success"
            segundoBotaoOnclick={props.handleClose}
            segundoBotaoCss="danger"
            segundoBotaoTexto="Cancelar"
            dataQa={props.dataQa}
        />
    )
};