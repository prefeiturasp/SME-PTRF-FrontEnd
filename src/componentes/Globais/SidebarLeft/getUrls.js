import React from "react";

import IconeMenuDadosDaAssociacao from '../../../assets/img/icone-menu-dados-da-associacao.svg'
import IconeMenuPainel from '../../../assets/img/icone-menu-painel.svg'
import IconeMenuCreditosDaEscola from '../../../assets/img/icone-menu-creditos-da-escola.svg'
import IconeMenuGastosDaEscola from '../../../assets/img/icone-menu-gastos-da-escola.svg'
import IconeMenuPrestacaoDeContas from '../../../assets/img/icone-menu-prestacao-de-contas.svg'

const UrlsMenuEscolas = [
    {label: "Dados da Associação", url: "dados-da-associacao", dataFor:"dados_da_associacao", icone:IconeMenuDadosDaAssociacao},
    {label: "Resumo dos recursos", url: "dashboard", dataFor:"resumo_dos_recursos", icone:IconeMenuPainel},
];

const UrlsMenuDres = [
    {label: "Créditos da escola", url: "lista-de-receitas", dataFor:"creditos_da_escola", icone:IconeMenuCreditosDaEscola},
    {label: "Gastos da escola", url: "lista-de-despesas", dataFor:"gastos_da_escola", icone:IconeMenuGastosDaEscola},
    {label: "Prestação de contas", url: "prestacao-de-contas", dataFor:"prestacao_de_contas", icone:IconeMenuPrestacaoDeContas},
];
const GetUrls = () =>{
    let visao = 'escolas';

    if (visao === "escolas"){
        return UrlsMenuEscolas
    }else if (visao=== "dres"){
        return UrlsMenuDres
    }
};

export const getUrls = {
    GetUrls
};