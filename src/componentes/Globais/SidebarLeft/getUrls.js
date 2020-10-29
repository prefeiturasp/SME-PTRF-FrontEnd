import React from "react";

import {USUARIO_NOME, ASSOCIACAO_NOME_ESCOLA, ASSOCIACAO_TIPO_ESCOLA} from '../../../services/auth.service'
import {visoesService} from "../../../services/visoes.service";
import IconeMenuPainel from '../../../assets/img/icone-menu-painel.svg'
import IconeMenuCreditosDaEscola from '../../../assets/img/icone-menu-creditos-da-escola.svg'
import IconeMenuGastosDaEscola from '../../../assets/img/icone-menu-gastos-da-escola.svg'
import IconeMenuPrestacaoDeContas from '../../../assets/img/icone-menu-prestacao-de-contas.svg'
import IconeDadosDaDiretoria from '../../../assets/img/icone-dados-da-diretoria.svg'
import IconeAcompanhamento from "../../../assets/img/icone-menu-dre-acompanhamento.svg"
import IconePainel from "../../../assets/img/icone-menu-dre-painel.svg"
import IconeRelatorio from "../../../assets/img/icone-menu-dre-relatorio.svg"
import IconeApoioDiretoria from "../../../assets/img/icone-apoio-a-diretoria.svg"
import IconeGestaoDePerfis from "../../../assets/img/icone-menu-gestao-de-perfis.svg"

const getDadosUsuario = () =>{
    let usuario = localStorage.getItem(USUARIO_NOME);
    return usuario ? usuario.split(' ')[0] : ''
};

const getDadosUnidade = () =>{
    return {
        tipo_escola: localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA) ? localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA) : "",
        nome_escola: localStorage.getItem(ASSOCIACAO_NOME_ESCOLA) ? localStorage.getItem(ASSOCIACAO_NOME_ESCOLA) : ""
    }
};

const UrlsMenuEscolas ={
    dados_iniciais: {
        default_selected: "dados-da-associacao",
        usuario: getDadosUsuario(),
        associacao_tipo_escola: getDadosUnidade().tipo_escola,
        associacao_nome_escola: getDadosUnidade().nome_escola
    },
    lista_de_urls:[
        {label: "Dados da Associação", url: "dados-da-associacao", dataFor:"dados_da_associacao", icone:IconeDadosDaDiretoria, permissoes: ['permissao_total'],},
        {label: "Resumo dos recursos", url: "dashboard", dataFor:"resumo_dos_recursos", icone:IconeMenuPainel, permissoes: ['view_dashboard', 'add_despesa',],},
        {label: "Créditos da escola", url: "lista-de-receitas", dataFor:"creditos_da_escola", icone:IconeMenuCreditosDaEscola, permissoes: ['add_receita'],},
        {label: "Gastos da escola", url: "lista-de-despesas", dataFor:"gastos_da_escola", icone:IconeMenuGastosDaEscola, permissoes: ['add_despesa', ],},
        {label: "Prestação de contas", url: "prestacao-de-contas", dataFor:"prestacao_de_contas", icone:IconeMenuPrestacaoDeContas, permissoes: ['permissao_total'],
            subItens: [
                {
                    label: "Conciliação Bancária", url: "detalhe-das-prestacoes", dataFor:"detalhe_das_prestacoes", icone:""
                },
                {
                    label: "Geração de documentos", url: "prestacao-de-contas", dataFor:"prestacao_de_contas", icone:""
                },
            ]
        },
        {label: "Gestão de perfis", url: "gestao-de-perfis", dataFor:"gestao_de_perfis", icone:IconeGestaoDePerfis, permissoes: ['permissao_total'],},
    ]
};

const UrlsMenuDres ={
    dados_iniciais: {
        default_selected: "dre-dashboard",
        usuario: getDadosUsuario(),
        associacao_tipo_escola: getDadosUnidade().tipo_escola,
        associacao_nome_escola: getDadosUnidade().nome_escola
    },
    lista_de_urls:[
        {label: "Painel", url: "dre-dashboard", dataFor:"dre_dashboard", icone:IconePainel, permissoes: ['permissao_total'],},
        {label: "Associações", url: "dre-associacoes", dataFor:"dre_associacoes", icone:IconeMenuGastosDaEscola, permissoes: ['permissao_total'],},
        {label: "Acompanhamento", url: "dre-dados-da-diretoria", dataFor:"dre_dados_da_diretoria", icone:IconeAcompanhamento, permissoes: ['permissao_total'],},
        {label: "Relatório consolidado", url: "dre-dados-da-diretoria", dataFor:"dre_dados_da_diretoria", icone:IconeRelatorio, permissoes: ['permissao_total']},
        {label: "Dados da Diretoria", url: "dre-dados-da-diretoria", dataFor:"dre_dados_da_diretoria", icone:IconeDadosDaDiretoria, permissoes: ['permissao_total']},
        {label: "Apoio à Diretoria", url: "dre-dados-da-diretoria", dataFor:"dre_dados_da_diretoria", icone:IconeApoioDiretoria, permissoes: ['permissao_total'],
            subItens: [
                {
                    label: "Perguntas Frequentes", url: "dre-faq", dataFor:"dre_dados_da_diretoria", icone:IconeDadosDaDiretoria
                }
            ]
        },
        {label: "Gestão de perfis", url: "gestao-de-perfis", dataFor:"gestao_de_perfis", icone:IconeGestaoDePerfis, permissoes: ['permissao_total'],},
    ]
};

const UrlsMenuSme ={
    dados_iniciais: {
        default_selected: "undefined",
        usuario: getDadosUsuario(),
        associacao_tipo_escola: getDadosUnidade().tipo_escola,
        associacao_nome_escola: getDadosUnidade().nome_escola
    },
    lista_de_urls:[
        {},
    ]
};

const GetUrls = () =>{

    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();

    if (dados_usuario_logado.visao_selecionada.nome === 'SME'){
        return UrlsMenuSme
    }else if(dados_usuario_logado.visao_selecionada.nome === 'DRE'){
        return UrlsMenuDres
    }else if (dados_usuario_logado.visao_selecionada.nome === 'UE'){
        return UrlsMenuEscolas
    }else {
        if ( dados_usuario_logado.visoes.find(visao=> visao.tipo === 'SME')){
            return UrlsMenuSme
        }else if (dados_usuario_logado.visoes.find(visao=> visao.tipo === 'DRE')){
            return UrlsMenuDres
        }else if (dados_usuario_logado.visoes.find(visao=> visao.tipo === 'UE')){
            return UrlsMenuEscolas
        }else {
            return UrlsMenuEscolas
        }
    }
};

export const getUrls = {
    GetUrls
};