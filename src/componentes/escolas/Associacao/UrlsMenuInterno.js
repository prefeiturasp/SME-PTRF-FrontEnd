import React from "react";
import { IconeDadosDaAssociacaoPendentes } from "./IconeDadosDaAssociacaoPendentes";

export const URLS = {
    DADOS_ASSOCIACAO: 'dados-da-associacao',
    MEMBROS_ASSOCIACAO: 'membros-da-associacao',
    CONTAS_ASSOCIACAO: 'dados-das-contas-da-associacao'
};

export const UrlsMenuInterno = [
    {label: "Dados da Associação", url: URLS.DADOS_ASSOCIACAO},
    {label: "Membros", url: URLS.MEMBROS_ASSOCIACAO},
    {label: "Dados das contas", url: URLS.CONTAS_ASSOCIACAO},
];

export const retornaMenuAtualizadoPorStatusCadastro = (statusCadastro) => {
    let urls = UrlsMenuInterno.map((menu) => {
        if(menu.url === URLS.DADOS_ASSOCIACAO && (statusCadastro && statusCadastro.pendencia_cadastro)){
            return {...menu, iconRight: <IconeDadosDaAssociacaoPendentes/>}
        } else if(menu.url === URLS.MEMBROS_ASSOCIACAO && (statusCadastro && statusCadastro.pendencia_membros)){
            return {...menu, iconRight: <IconeDadosDaAssociacaoPendentes/>}
        } else if (menu.url === URLS.CONTAS_ASSOCIACAO && (statusCadastro && statusCadastro.pendencia_contas)){
            return {...menu, iconRight: <IconeDadosDaAssociacaoPendentes/>}
        }
        return menu;
    }); 
    return urls;       
};