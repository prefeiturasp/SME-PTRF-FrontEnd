import React, {Fragment, useState, useEffect} from "react";
import { DADOS_DA_ASSOCIACAO } from "../../../../services/auth.service";
import { Navigate, useParams } from "react-router-dom";
import { TopoComBotoes } from "./TopoComBotoes";
import {InfosAssociacao} from "./DadosDaAssociacao/InfosAssociacao";
import {InfosUnidadeEducacional} from "./DadosDaUnidadeEducacional/InfosUnidadeEducacional";
import { InfosContas } from "./DadosDasContas/InfosContas";
import { ProcessoSeiRegularidade } from "./ProcessosSei/ProcessoSeiRegularidade";
import { ProcessosSeiPrestacaoDeContas } from "./ProcessosSei/ProcessosSeiPrestacaoDeContas";
import { SituacaoFinanceiraUnidadeEducacional } from "./SituacaoFinanceiraUnidadeEducacional";
import {visoesService} from "../../../../services/visoes.service"
import { SituacaoPatrimonialUnidadeEducacional } from "./SituacaoPatrimonial";
import "../associacoes.scss"
import useRecursoSelecionado from "../../../../hooks/Globais/useRecursoSelecionado";

export const DetalhesDaAssociacao = () => {
    const { origem } = useParams();
    const { recursos, recursoSelecionado } = useRecursoSelecionado({ visoesService });

    const [clickBtnEscolheOpcao, setClickBtnEscolheOpcao] = useState({
        dados_unidade: true,
        dados_associacao: false,
        contas_associacao: false,
        processos_sei: false,
        situacao_financeira: false,
        situacao_patrimonial: false
    });

    const [activeTab, setActiveTab] = useState({
        dados_unidade: true,
        dados_associacao: false,
        contas_associacao: false,
        processos_sei: false,
        situacao_financeira: false,
        situacao_patrimonial: false
    });
    let dadosDaAssociacao = JSON.parse(localStorage.getItem(DADOS_DA_ASSOCIACAO));

    let tabs = [
        {
            id: "dados_unidade",
            nome: "Dados da unidade",
            permissao: visoesService.getPermissoes(["access_dados_unidade_dre"])
        },

        {
            id: "dados_associacao",
            nome: "Dados da associação",
            permissao: visoesService.getPermissoes(["access_dados_unidade_dre"])
        },
        {
            id: "contas_associacao",
            nome: "Contas da associação",
            permissao: visoesService.getPermissoes(["access_dados_unidade_dre"])
        },
        {
            id: "processos_sei",
            nome: "Processos SEI",
            permissao: visoesService.getPermissoes(['access_processo_sei'])
        },
        {
            id: "situacao_financeira",
            nome: "Situação Financeira",
            permissao: visoesService.getPermissoes(["access_situacao_financeira_dre"])
        },
        {
            id: "situacao_patrimonial",
            nome: "Situação Patrimonial",
            permissao: visoesService.getPermissoes(["access_situacao_patrimonial_dre"])
        },
    ]

    let recurso_tabs = recursos
        .sort((a, b) => {
            if (a.nome_exibicao === "PTRF") return -1;
            if (b.nome_exibicao === "PTRF") return 1;
            
            return a.nome_exibicao.localeCompare(b.nome_exibicao);
        })
        .map((recurso) => ({
            id: recurso.uuid,
            nome: recurso.nome,
            nome_exibicao: recurso.nome_exibicao,
            permissao: visoesService.getPermissoes(["access_dados_unidade_dre"])
        }))

    let conteudo_tab = {
        dados_unidade : {
            id: tabs[0].id,
            permissao: visoesService.getPermissoes(["access_dados_unidade_dre"])
        },
        dados_associacao : {
            id: tabs[1].id,
            permissao: visoesService.getPermissoes(["access_dados_unidade_dre"])
        },
        contas_associacao : {
            id: tabs[2].id,
            permissao: visoesService.getPermissoes(["access_dados_unidade_dre"])
        },
        processos_sei : {
            id: tabs[3].id,
            permissao: visoesService.getPermissoes(['access_processo_sei'])
        },
        situacao_financeira : {
            id: tabs[4].id,
            permissao: visoesService.getPermissoes(["access_situacao_financeira_dre"])
        },
        situacao_patrimonial : {
            id: tabs[5].id,
            permissao: visoesService.getPermissoes(["access_situacao_patrimonial_dre"])
        },
    }

    useEffect(() => {
        verificaUrl();
    }, [])



    const setPrimeiroActive = () => {
        let novoEstadoConteudo = {
            dados_unidade: false,
            dados_associacao: false,
            contas_associacao: false,
            processos_sei: false,
            situacao_financeira: false,
            situacao_patrimonial: false
        }

        let novoEstadoAba = {
            dados_unidade: false,
            dados_associacao: false,
            contas_associacao: false,
            processos_sei: false,
            situacao_financeira: false,
            situacao_patrimonial: false
        }

        for(let i=0; i<=tabs.length-1; i++){
            
            if(tabs[i].permissao){
                novoEstadoConteudo[tabs[i].id] = true;
                novoEstadoAba[tabs[i].id] = true;
                break
            }
        }

        setActiveTab(novoEstadoConteudo);
        setClickBtnEscolheOpcao(novoEstadoAba);
    }

    

    const verificaUrl = () => {
        /* 
            Essa função verifica se o usuario está acessando a página atraves de associações
            ou através do relatório consolidado
        */

        let url = window.location.pathname;
        let origemRelatorio = "dre-relatorio-consolidado"
        let acessouPeloRelatorioConsolidado = url.indexOf(origemRelatorio) !== -1;

        if (acessouPeloRelatorioConsolidado){
            let novoEstadoAba = {
                dados_unidade: false,
                dados_associacao: false,
                contas_associacao: false,
                processos_sei: false,
                situacao_financeira: false,
                situacao_patrimonial: false
            }

            let novoEstadoConteudo = {
                dados_unidade: false,
                dados_associacao: false,
                contas_associacao: false,
                processos_sei: false,
                situacao_financeira: false,
                situacao_patrimonial: false
            }

            setClickBtnEscolheOpcao(novoEstadoAba);
            setActiveTab(novoEstadoConteudo);  
        }
        else if (origem === "situacao-patrimonial") {
            // Se veio da situação patrimonial, ativa a aba de situação patrimonial
            let novoEstadoAba = {
                dados_unidade: false,
                dados_associacao: false,
                contas_associacao: false,
                processos_sei: false,
                situacao_financeira: false,
                situacao_patrimonial: true
            }

            let novoEstadoConteudo = {
                dados_unidade: false,
                dados_associacao: false,
                contas_associacao: false,
                processos_sei: false,
                situacao_financeira: false,
                situacao_patrimonial: true
            }

            setClickBtnEscolheOpcao(novoEstadoAba);
            setActiveTab(novoEstadoConteudo);
        }
        else{
            setPrimeiroActive();
        }
        
        
    }

    const toggleBtnEscolheOpcao = (id) => {
        setClickBtnEscolheOpcao({
            [id]: !clickBtnEscolheOpcao[id]
        });
    };

    const handleTabClick = (id) => {
        toggleBtnEscolheOpcao(id);
        
        // Se for a aba de processos_sei e houver mais de 1 recurso, seleciona a primeira aba de recurso
        if (id === "processos_sei" && recursos.length > 1 && recurso_tabs.length > 0) {
            setClickBtnEscolheOpcao(prev => ({
                ...prev,
                [recurso_tabs[0].id]: true
            }));
        }
    };

    return (
        <>
            {dadosDaAssociacao ? (
                    <>
                        <TopoComBotoes
                            dadosDaAssociacao={dadosDaAssociacao}
                        />
                        <nav>
                            <div className="nav nav-tabs mb-3 mt-5 menu-interno-dre-detalhes" id="nav-tab" role="tablist">
                                {tabs.map((tab, index) => {
                                    return tab.permissao 
                                        ?
                                            <Fragment key={index}>
                                                <a
                                                    onClick={() => {
                                                        handleTabClick(tab.id);
                                                    }}
                                                    className={`nav-link btn-escolhe-aba ${clickBtnEscolheOpcao[tab.id] ? "btn-escolhe-aba-active" : ""}`}
                                                    id={`nav-${tab.id}-tab`}
                                                    data-toggle="tab"
                                                    href={`#nav-${tab.id}`}
                                                    role="tab"
                                                    aria-controls={`nav-${tab.id}`}
                                                    aria-selected="true"
                                                >
                                                    {tab.nome}
                                                </a>
                                            </Fragment>

                                        : 
                                            null
                                })}                                 

                            </div>
                        </nav>

                        <div className="tab-content" id="nav-tabContent">
                            {conteudo_tab.dados_unidade.permissao 
                                ? 
                                    <div
                                        className={`tab-pane fade show ${activeTab.dados_unidade ? "active" : ""}`}
                                        id={`nav-${conteudo_tab.dados_unidade.id}`}
                                        role="tabpanel"
                                        aria-labelledby={`nav-${conteudo_tab.dados_unidade.id}-tab`}
                                    >
                                        <div className="page-content-inner">
                                            <InfosUnidadeEducacional
                                                dadosDaAssociacao={dadosDaAssociacao}
                                            />
                                        </div>
                                    </div>
                                :null
                            }

                            {conteudo_tab.dados_associacao.permissao 
                                ?
                                    <div
                                        className={`tab-pane fade show ${activeTab.dados_associacao ? "active" : ""}`}
                                        id={`nav-${conteudo_tab.dados_associacao.id}`}
                                        role="tabpanel"
                                        aria-labelledby={`nav-${conteudo_tab.dados_associacao.id}-tab`}
                                    >
                                        <div className="page-content-inner">
                                            <InfosAssociacao
                                                dadosDaAssociacao={dadosDaAssociacao}
                                            />
                                        </div>
                                    </div>
                                :
                                    null
                            }

                            {conteudo_tab.contas_associacao.permissao 
                                ?
                                    <div
                                        className={`tab-pane fade show ${activeTab.contas_associacao ? "active" : ""}`}
                                        id={`nav-${conteudo_tab.contas_associacao.id}`}
                                        role="tabpanel"
                                        aria-labelledby={`nav-${conteudo_tab.contas_associacao.id}-tab`}
                                    >
                                        <div className="page-content-inner">
                                            <InfosContas
                                                dadosDaAssociacao={dadosDaAssociacao}
                                            />
                                        </div>
                                    </div>
                                :
                                    null
                            }

                            {conteudo_tab.processos_sei.permissao 
                                ?
                                    <div
                                        className={`tab-pane fade show ${activeTab.processos_sei ? "active" : ""}`}
                                        id={`nav-${conteudo_tab.processos_sei.id}`}
                                        role="tabpanel"
                                        aria-labelledby={`nav-${conteudo_tab.processos_sei.id}-tab`}
                                    >
                                        <div className="page-content-inner">
                                            <ProcessoSeiRegularidade
                                                dadosDaAssociacao={dadosDaAssociacao}
                                            />

                                            { visoesService.featureFlagAtiva('premio-excelencia-processo-sei') && recursos.length > 1 ? (
                                                <>
                                                    <nav>
                                                        <div className="nav nav-tabs mb-3 mt-3 menu-interno-dre-detalhes" id="nav-tab" role="tablist">
                                                            {recurso_tabs.map((tab, index) => {
                                                                return tab.permissao 
                                                                    ?
                                                                        <Fragment key={index}>
                                                                            <a onClick={() => {
                                                                                    // Ativa aba de recurso e mantém a aba de Processos SEI ativa.
                                                                                    setClickBtnEscolheOpcao({
                                                                                        [tab.id]: true,
                                                                                        processos_sei: true
                                                                                    });
                                                                                }}
                                                                                className={`nav-link btn-escolhe-aba ${clickBtnEscolheOpcao[tab.id] ? "btn-escolhe-aba-active" : ""}`}
                                                                                id={`nav-${tab.id}-tab`}
                                                                                data-toggle="tab"
                                                                                href={`#nav-${tab.id}`}
                                                                                role="tab"
                                                                                aria-controls={`nav-${tab.id}`}
                                                                                aria-selected="true"
                                                                            >
                                                                                {tab.nome_exibicao}
                                                                            </a>
                                                                        </Fragment>

                                                                    : 
                                                                        null
                                                            })}                                 
                                                        </div>
                                                    </nav>

                                                    <div className="tab-content" id="nav-recurso-tabContent">
                                                        {recurso_tabs.map((tab, index) => {
                                                            return tab.permissao 
                                                                ?
                                                                    <div
                                                                        key={index}
                                                                        className={`tab-pane fade show ${clickBtnEscolheOpcao[tab.id] ? "active" : ""}`}
                                                                        id={`nav-${tab.id}`}
                                                                        role="tabpanel"
                                                                        aria-labelledby={`nav-${tab.id}-tab`}
                                                                    >
                                                                        <div className="page-content-inner">
                                                                            <ProcessosSeiPrestacaoDeContas
                                                                                dadosDaAssociacao={dadosDaAssociacao}
                                                                                recurso_uuid={tab.id}
                                                                                recurso_nome={tab.nome}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                :
                                                                    null
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <ProcessosSeiPrestacaoDeContas
                                                    dadosDaAssociacao={dadosDaAssociacao}
                                                    recurso_uuid={recursoSelecionado?.uuid || ''}
                                                />
                                            )}
                                        </div>
                                    </div>
                                :
                                    null
                            }

                            {conteudo_tab.situacao_financeira.permissao 
                                ?
                                    <div
                                        className={`tab-pane fade show ${activeTab.situacao_financeira ? "active" : ""}`}
                                        id={`nav-${conteudo_tab.situacao_financeira.id}`}
                                        role="tabpanel"
                                        aria-labelledby={`nav-${conteudo_tab.situacao_financeira.id}-tab`}
                                    >
                                        <div className="page-content-inner">
                                            <SituacaoFinanceiraUnidadeEducacional
                                                dadosDaAssociacao={dadosDaAssociacao}
                                            />
                                            
                                        </div>
                                    </div>
                                :
                                    null
                            }

                            {conteudo_tab.situacao_patrimonial.permissao
                                ?
                                    <div 
                                        className={`tab-pane fade show ${activeTab.situacao_patrimonial ? "active" : ""}`} 
                                        id={`nav-${conteudo_tab.situacao_patrimonial.id}`} 
                                        role="tabpanel" 
                                        aria-labelledby={`nav-${conteudo_tab.situacao_patrimonial.id}-tab`}
                                    >
                                        <div className="page-content-inner">
                                            <SituacaoPatrimonialUnidadeEducacional visao_dre={true} />
                                        </div>
                                    </div>
                                :
                                    null
                            }
                        </div>
                    </>
                ) :
                <Navigate
                    to={{
                        pathname: "/dre-associacoes",
                    }}
                    replace
                />
            
            }
        </>
    );
}