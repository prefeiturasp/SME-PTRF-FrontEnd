import React, {memo} from "react";
import {RegularidadeAssociacaoNoAno} from "./RegularidadeAssociacaoNoAno";

export const TabsAnaliseAnoVigenteHistorico = ({
                                           associacaoUuid,
                                       }) => {

    const anoVigente = new Date().getFullYear()

    return(
        <>
            <div className="row">
                <div className="d-flex bd-highlight">
                    <div className="flex-grow-1 bd-highlight titulo-explicativo-dre-detalhes-regularidade">
                        <p className="mb-1 ml-2">Regularidade da associação</p>
                    </div>

                </div>
            </div>
            <nav>
                <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">      

                    <a
                        onClick={() => {}}
                        className="nav-link btn-escolhe-acao active"
                        id="nav-conferencia-atual-tab" data-toggle="tab"
                        href="#nav-ano-vigente"
                        role="tab"
                        aria-controls="nav-ano-vigente"
                        aria-selected="true"
                    >
                        Ano vigente: {anoVigente}
                    </a>

                    <a
                        onClick={() => {}}
                        className={`nav-link btn-escolhe-acao`}
                        id="nav-historico-tab"
                        data-toggle="tab"
                        href="#nav-historico"
                        role="tab"
                        aria-controls="nav-historico"
                        aria-selected="false"
                    >
                        Histórico
                    </a>
                </div>
            </nav>

            <div className="tab-content" id="nav-tabContent">
                <div className={`tab-pane fade show active`} id="nav-ano-vigente" role="tabpanel" aria-labelledby="nav-ano-vigente-tab">
                    <RegularidadeAssociacaoNoAno associacaoUuid={associacaoUuid} ano={anoVigente}/>
                </div>
                <div className={`tab-pane fade`} id="nav-historico" role="tabpanel" aria-labelledby="nav-historico-tab">
                    <h1>Teste aba histórico</h1>
                </div>
            </div>
        </>
    )
}

