import React from "react";
import { ModalBootstrap } from "../../Globais/ModalBootstrap";

export const ModalDevolucaoNaoPermitida = ({ show, handleClose, mensagem }) => {
    const mensagemPadrao = "O saldo bancário da conta informada foi modificado e não é permitido devolução. Favor retornar o saldo bancário para o valor original indicado na entrega da prestação de contas.";
    const textoInformado = mensagem && mensagem.trim().length ? mensagem.trim() : '';
    const possuiHtml = textoInformado.includes('<');
    const texto = textoInformado
        ? possuiHtml ? textoInformado : `<p>${textoInformado}</p>`
        : `<p>${mensagemPadrao}</p>`;

    return (
        <ModalBootstrap
            show={show}
            onHide={handleClose}
            titulo="Devolução não permitida"
            bodyText={texto}
            primeiroBotaoOnclick={handleClose}
            primeiroBotaoTexto="Confirmar"
            primeiroBotaoCss="success"
            dataQa="modal-devolucao-nao-permitida"
        />
    );
};
