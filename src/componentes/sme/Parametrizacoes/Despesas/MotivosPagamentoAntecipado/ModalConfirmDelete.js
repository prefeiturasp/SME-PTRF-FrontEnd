import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalConfirmDelete = (props) => {
    return (
        <ModalBootstrap
            data-qa="modal-confirmar-exclusao-motivo-pagamento-antecipado"
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoOnclick={props.onDeleteTrue}
            segundoBotaoCss={props.segundoBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
        />
    )
};
