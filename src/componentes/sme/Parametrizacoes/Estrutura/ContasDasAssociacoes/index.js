import React from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { ContasDasAssociacoesProvider } from "./context/ContasDasAssociacoesContext";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { Filtros } from "./components/Filtros";
import { Lista } from "./components/Lista";
import { UrlsMenuInterno } from "./UrlsMenuInterno";


export const ContasDasAssociacoes = () => {
    return (
        <ContasDasAssociacoesProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Contas das Associações</h1>
                <div className="page-content-inner">
                    <AbasPorRecurso
                        extra_abas={UrlsMenuInterno}
                    />
                    <TopoComBotoes />
                    <Filtros />
                    <Lista />
                </div>
            </PaginasContainer>
        </ContasDasAssociacoesProvider>
    );
}