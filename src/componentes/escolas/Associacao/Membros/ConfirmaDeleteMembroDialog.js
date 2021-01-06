import {ModalBootstrap} from "../../../Globais/ModalBootstrap";

import React from "react";

export const ConfirmaDeleteMembro = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Excluir o membro da associação"
            bodyText="<p>Deseja excluir o membro para esse cargo?</p>"
            segundoBotaoOnclick={propriedades.onConfirmDelete}
            segundoBotaoTexto="Excluir"
            segundoBotaoCss="danger"
            primeiroBotaoOnclick={propriedades.onCancelDelete}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
        />
    )
};
