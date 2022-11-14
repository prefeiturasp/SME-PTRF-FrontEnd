import React from 'react';
import './styles.scss'

export const TabsConferencia = ({}) => {
    // #LINIKER: So exibir a tabe coferencia atual quando for status em_analise
    return <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">      
        <a
            // onClick={}
            className="nav-link btn-escolhe-acao active"
            id="nav-conferencia-atual-tab" data-toggle="tab"
            // href="#nav-conferencia-atual"
            role="tab"
            aria-controls="nav-conferencia-atual"
            aria-selected="true"
        >
            Conferência atual
        </a>
        <a
            // onClick={}
            className={`nav-link btn-escolhe-acao`}
            id="nav-historico-tab"
            data-toggle="tab"
            // href="#nav-historico"
            role="tab"
            aria-controls="nav-historico"
            // aria-selected={pcEmAnalise === false ? 'true' : 'false'}
        >
            Histórico de conferência 
        </a>
</div>
    
}
