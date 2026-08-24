import { ModalBootstrap } from "../../../../../Globais/ModalBootstrap";
import React from "react";
import { useAcoesContext } from "../hooks/useAcoesContext";

export const ModalInfoNaoPodeGravar = () => {
    const { showModalInfoNaoPodeGravar, handleCloseInfoNaoPodeGravar, mensagemModalInfoNaoPodeGravar } = useAcoesContext();

    return (
        <ModalBootstrap
            show={showModalInfoNaoPodeGravar}
            onHide={handleCloseInfoNaoPodeGravar}
            titulo="Atualização não permitida"
            bodyText={mensagemModalInfoNaoPodeGravar}
            primeiroBotaoOnclick={handleCloseInfoNaoPodeGravar}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="success"
        />
    )
};
