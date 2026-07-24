import React from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";

import { MotivosEstornoProvider } from "./context/MotivosEstorno";
import { Lista } from "./components/Lista";
import { Filtro } from "./components/Filtro";
import { TopoComBotoes } from "./components/TopoComBotoes";

export const ParametrizacoesMotivosDeEstorno = () => {
    return (
        <MotivosEstornoProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Motivos de estorno</h1>
                <div className="page-content-inner">
                    <AbasPorRecurso />
                    <TopoComBotoes />
                    <Filtro />
                    <Lista />
                </div>
            </PaginasContainer>
        </MotivosEstornoProvider>
    );
};
