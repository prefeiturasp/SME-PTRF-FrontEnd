import React from 'react';
import './styles.scss'

export const TabsConferencia = ({relatorioConsolidado, tabAtual, setTabAtual}) => {


    return <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos mt-3" id="nav-tab-conferencia-de-lancamentos" role="tablist">
        {
        relatorioConsolidado?.analises_do_consolidado_dre.length > 1 ? <>
            <a className={`nav-link btn-escolhe-acao active`}
                id="nav-conferencia-atual-tab"
                data-toggle="tab"
                href="#nav-conferencia-atual"
                role="tab"
                aria-controls="nav-conferencia-atual"
                onClick={(e) => setTabAtual('conferencia-atual')}
                aria-selected="true">
                Conferência atual
            </a>
            <a className={`nav-link btn-escolhe-acao`}
                id="nav-historico-tab"
                data-toggle="tab"
                href="#nav-historico"
                role="tab"
                onClick={(e) => setTabAtual('historico')}
                aria-controls="nav-historico">
                Histórico de conferência
            </a>
        </> : <a className={`nav-link btn-escolhe-acao active`}
            id="nav-conferencia-atual-tab"
            data-toggle="tab"
            href="#nav-conferencia-atual"
            role="tab"
            aria-controls="nav-conferencia-atual"
            aria-selected="true">
            Conferência atual
        </a>
    } </div>

}
