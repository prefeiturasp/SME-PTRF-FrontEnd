import React from "react";
import {ModalBootstrap} from "../componentes/ModalBootstrap";

export const AvisoCapitalModal = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Aviso"
            bodyText="<p>A relação de bens de capital é a mesma utilizada no Sistema de Bens Patrimoniais Móveis (SBPM) da Prefeitura de São Paulo e, portanto, nem todos os itens podem ser adquiridos com os recursos do PTRF.</p>"
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Estou Ciente"
        />
    )
}

export const CancelarModal = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Cancelar cadastro"
            bodyText="<p>Tem certeza que deseja cancelar esse cadastramento? As informações não serão salvas</p>"
            primeiroBotaoOnclick={propriedades.onCancelarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
}

export const DeletarModal = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Deseja excluir esta Despesa?"
            bodyText="<p>Tem certeza que deseja excluir esta despesa? A ação não poderá ser desfeita.</p>"
            primeiroBotaoOnclick={propriedades.onDeletarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
}
