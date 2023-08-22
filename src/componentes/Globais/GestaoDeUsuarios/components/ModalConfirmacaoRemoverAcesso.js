
import React from "react";
import {ModalBootstrap} from "../../ModalBootstrap";

export const ModalConfirmacaoRemoverAcesso = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.botaoCancelarHandle}
            titulo="Remover acesso"
            bodyText="<p>Tem certeza que deseja remover o acesso deste usuário nessa unidade?</p>"
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            primeiroBotaoOnclick={props.botaoCancelarHandle}
            segundoBotaoTexto="Remover acesso"
            segundoBotaoCss="danger"
            segundoBotaoOnclick={props.botaoConfirmarHandle}
        />
    )
};
