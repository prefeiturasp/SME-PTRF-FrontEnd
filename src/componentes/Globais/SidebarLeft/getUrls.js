import React from "react";

import IconeMenuDadosDaAssociacao from '../../../assets/img/icone-menu-dados-da-associacao.svg'
import IconeMenuPainel from '../../../assets/img/icone-menu-painel.svg'

const UrlsMenuEscolas = [
    {label: "Dados da Associação", url: "dados-da-associacao", dataFor:"dados_da_associacao", icone:IconeMenuDadosDaAssociacao},
    {label: "Resumo dos recursos", url: "dashboard", dataFor:"resumo_dos_recursos", icone:IconeMenuPainel},
];
const GetUrls = () =>{
    let visao = 'dre';

    if (visao === "dre"){
        return UrlsMenuEscolas
    }
};

export const getUrls = {
    GetUrls
}