import React from 'react';
import './styles.scss'

export const TabsConferencia = ({relatorioConsolidado}) => {
    return <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">
        {
        relatorioConsolidado ?.status_sme === 'EM_ANALISE' ? <a
            className={`nav-link btn-escolhe-acao active`}
            id="nav-conferencia-atual-tab"
            data-toggle="tab"
            href="#nav-conferencia-atual"
            role="tab"
            aria-controls="nav-conferencia-atual"
            aria-selected="true"
        >
            Conferência atual
        </a> : <a
            className={`nav-link btn-escolhe-acao active`}
            id="nav-historico-tab"
            data-toggle="tab"
            href="#nav-historico"
            role="tab"
            aria-controls="nav-historico"
        >
            Histórico de conferência
        </a>
    } </div>

}
