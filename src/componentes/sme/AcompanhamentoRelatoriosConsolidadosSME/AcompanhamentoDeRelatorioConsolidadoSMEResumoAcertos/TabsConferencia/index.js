import React, { useEffect, useCallback } from 'react';
import {Ordinais} from '../../../../../utils/ValidacoesNumeros.js'
// import { detalhamentoConferenciaDocumentos } from "../../../../../services/sme/AcompanhamentoSME.service"
import './styles.scss'


export const TabsConferencia = ({relatorioConsolidado, tabAtual, setTabAtual, setAnaliseSequenciaVisualizacao}) => {

    useEffect(() => {
        if (relatorioConsolidado?.analises_do_consolidado_dre && tabAtual !== 'historico'){
            let sequenciaConferencia = relatorioConsolidado?.analises_do_consolidado_dre[relatorioConsolidado?.analises_do_consolidado_dre.length - 2] 
            let newAnaliseSequencia = {
                sequenciaConferencia,
                'versao': Ordinais(relatorioConsolidado?.analises_do_consolidado_dre.indexOf(sequenciaConferencia)),
                'versao_numero':  relatorioConsolidado?.analises_do_consolidado_dre.length - 1
            }
            setAnaliseSequenciaVisualizacao(newAnaliseSequencia)
        }
        }, [tabAtual])

    return <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos mt-3" id="nav-tab-conferencia-de-lancamentos" role="tablist">
        {
        relatorioConsolidado?.status_sme === "EM_ANALISE" && relatorioConsolidado?.analises_do_consolidado_dre.length >= 2 ?
            <>
            <a className={`nav-link btn-escolhe-acao ${tabAtual === 'conferencia-atual' ? 'active' : ''}`}
                id="nav-conferencia-atual-tab"
                data-toggle="tab"
                href="#nav-conferencia-atual"
                role="tab"
                aria-controls="nav-conferencia-atual"
                onClick={(e) => setTabAtual('conferencia-atual')}
                aria-selected="true">
                Conferência atual
            </a>
            <a className={`nav-link btn-escolhe-acao ${tabAtual === 'historico' ? 'active' : ''}` }
                id="nav-historico-tab"
                data-toggle="tab"
                href="#nav-historico"
                role="tab"
                onClick={(e) => setTabAtual('historico')}
                aria-controls="nav-historico">
                Histórico de conferência
            </a>
        </> : 
        relatorioConsolidado?.status_sme === "EM_ANALISE" ? <>
            <a className={`nav-link btn-escolhe-acao active ${tabAtual === 'conferencia-atual' ? 'active' : ''}`}
                id="nav-conferencia-atual-tab"
                data-toggle="tab"
                href="#nav-conferencia-atual"
                role="tab"
                aria-controls="nav-conferencia-atual"
                onClick={(e) => setTabAtual('conferencia-atual')}
                aria-selected="true">
                Conferência atual
            </a>
        </> : 
        <a className={`nav-link btn-escolhe-acao active ${tabAtual === 'historico' ? 'active' : ''}` }
                id="nav-historico-tab"
                data-toggle="tab"
                href="#nav-historico"
                role="tab"
                onClick={(e) => setTabAtual('historico')}
                aria-controls="nav-historico">
                Histórico de conferência
            </a>
    } </div>

}
