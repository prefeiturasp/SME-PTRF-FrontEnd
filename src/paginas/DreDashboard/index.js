import React from "react";
import {PaginasContainer} from '../PaginasContainer'
import {DreDashboard} from "../../componentes/dres/Dashboard";

export const DreDashboardPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <DreDashboard/>
            </div>
        </PaginasContainer>
    )
};