import {ModalBootstrap} from "../../../Globais/ModalBootstrap";
import React from "react";

export const ConfirmaDeleteTecnico = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Excluir o técnico da diretoria"
            bodyText="<p>Tem certeza que deseja excluir esse técnico?</p>"
            segundoBotaoOnclick={propriedades.onConfirmDelete}
            segundoBotaoTexto="Excluir"
            segundoBotaoCss="danger"
            primeiroBotaoOnclick={propriedades.onCancelDelete}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
        />
    )
};
