
import React from "react";
import {ModalBootstrap} from "../../ModalBootstrap";

export const ModalConfirmacaoRemoverAcesso = (props) => {
    let mensagem = ""

    if (props.visao === "UE") {
        mensagem = "<p>Tem certeza que deseja remover o acesso deste usuário nessa unidade?</p>"
    } else if (props.visao === "DRE") {
        mensagem = "<p>Tem certeza que deseja remover o acesso deste usuário nesta DRE e em suas unidades, se houver?</p><p>Observação: Para remover o acesso a apenas uma de suas unidades, basta desabilitá-lo na referida unidade.</p>"
    } else if (props.visao === "SME") {
        mensagem = "<p>Tem certeza que deseja remover o acesso deste usuário em todas as unidades?</p><p>Observação: Para remover o acesso a apenas uma de suas unidades, basta desabilitá-lo na referida unidade.</p>"
    }
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.botaoCancelarHandle}
            titulo="Remover acesso"
            bodyText={mensagem}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            primeiroBotaoOnclick={props.botaoCancelarHandle}
            segundoBotaoTexto="Remover acesso"
            segundoBotaoCss="danger"
            segundoBotaoOnclick={props.botaoConfirmarHandle}
        />
    )
};
