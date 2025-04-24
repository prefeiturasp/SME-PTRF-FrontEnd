import React from "react";
import { PeriodosPaaProvider } from "./context/index";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./TopoComBotoes";
import { Tabela } from "./Tabela";
import { Paginacao } from "./Paginacao";
import { Filtros } from "./Filtros";


export const PeriodosPaa = () => {
    return (
        <PeriodosPaaProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Períodos PAA</h1>
                <div className="page-content-inner">
                    <TopoComBotoes/>
                    <Filtros/>
                    <Tabela/>
                    <Paginacao/>
                </div>
            </PaginasContainer>
        </PeriodosPaaProvider>   
    )
}