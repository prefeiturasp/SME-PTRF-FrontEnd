import React, { useContext, useEffect } from "react";
import {PaginasContainer} from '../../PaginasContainer'
import {DreDashboard} from "../../../componentes/dres/Dashboard";
import { SidebarContext } from "../../../context/Sidebar";

export const DreDashboardPage = () => {
    const { itensNavegacaoAtivadaViaFlag, redicionaDRESemPermissaoAcompanhamentoPC } = useContext(SidebarContext);

    useEffect(() => {
        redicionaDRESemPermissaoAcompanhamentoPC()
    }, [itensNavegacaoAtivadaViaFlag])

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <DreDashboard/>
            </div>
        </PaginasContainer>
    )
};