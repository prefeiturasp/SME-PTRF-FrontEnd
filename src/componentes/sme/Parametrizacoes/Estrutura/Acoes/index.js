import React from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { AcoesContextProvider } from "./context/AcoesContext";
import { ModalConfirmDeleteAcao } from "./components/ModalConfirmDeleteAcao";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { ModalFormAcoes } from "./components/ModalFormAcoes";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { TabelaAcoes } from "./components/TabelaAcoes";
import { Filtros } from "./components/Filtros";
import '../parametrizacoes-estrutura.scss'
import { useLocation } from "react-router-dom";

export const Acoes = () => {
    const location = useLocation();
    const tab_initial_active = location.state?.recurso_uuid || null;

    return (
        <PaginasContainer>
            <AcoesContextProvider>
                <h1 className="titulo-itens-painel mt-5">Ações</h1>
                <div className="page-content-inner">
                    <AbasPorRecurso tab_initial_active={tab_initial_active} />
                    
                    <TopoComBotoes />
                    
                    <Filtros />

                    <TabelaAcoes />

                    <ModalFormAcoes />

                    <ModalConfirmDeleteAcao />
                </div>
            </AcoesContextProvider>
        </PaginasContainer>
    );
};