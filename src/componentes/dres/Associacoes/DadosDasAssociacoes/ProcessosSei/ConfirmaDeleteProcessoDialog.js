import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";
import React from "react";

export const ConfirmaDeleteProcesso = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Excluir o número do processo SEI"
            bodyText="<p>Tem certeza que deseja excluir esse número de processo?</p>"
            segundoBotaoOnclick={propriedades.onConfirmDelete}
            segundoBotaoTexto="Excluir"
            segundoBotaoCss="danger"
            primeiroBotaoOnclick={propriedades.onCancelDelete}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
        />
    )
};
