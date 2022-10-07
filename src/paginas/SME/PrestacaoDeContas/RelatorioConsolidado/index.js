import React from "react";
import {PaginasContainer} from '../../../PaginasContainer'
import {SmeDashboard} from "../../../../componentes/sme/Dashboard";

export const RelatorioConsolidadoPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Análise dos relatórios consolidados das DRES</h1>
            <div className="page-content-inner">
                <SmeDashboard/>
            </div>
        </PaginasContainer>
    )
};