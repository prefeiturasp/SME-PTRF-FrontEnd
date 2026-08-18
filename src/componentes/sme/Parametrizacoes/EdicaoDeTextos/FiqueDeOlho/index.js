import React from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { FiqueDeOlhoProvider } from "./context/FiqueDeOlho";

import { Lista } from "./components/Lista";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { Filtros } from "./components/Filtros";

import "../parametrizacoes-edicao-de-textos.scss"

export const FiqueDeOlho = () => {
    return (
        <FiqueDeOlhoProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Textos do Fique de Olho</h1>

                <div className="page-content-inner">
                    <AbasPorRecurso />

                    <TopoComBotoes />

                    <Filtros />

                    <Lista />
                </div>
            </PaginasContainer>
        </FiqueDeOlhoProvider>
    );
};
