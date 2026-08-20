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

export const Acoes = () => {
    return (
        <PaginasContainer>
            <AcoesContextProvider>
                <h1 className="titulo-itens-painel mt-5">Ações</h1>
                <div className="page-content-inner">
                    <AbasPorRecurso />
                    
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