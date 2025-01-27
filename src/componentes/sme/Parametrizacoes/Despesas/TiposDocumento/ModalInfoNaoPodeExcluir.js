import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalInfoNaoPodeExcluir = (props) => {
    return (
        <ModalBootstrap
            data-qa="modal-info-nao-pode-excluir-tipo-documento"
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
        />
    )
};