import React from "react";

import { TopoComBotoes } from "./components/TopoComBotoes";
import { Filtros } from "./components/Filtros";
import { Lista } from "./components/Lista";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { MotivosReprovacaoPcProvider } from "./context/MotivosReprovacaoPc";

export const ParametrizacoesMotivosReprovacaoPc = () => {
    return (
        <MotivosReprovacaoPcProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Motivos de reprovação de PC</h1>

                <div className="page-content-inner">
                    <AbasPorRecurso />
                    
                    <TopoComBotoes />

                    <Filtros />

                    <Lista />
                </div>
            </PaginasContainer>
        </MotivosReprovacaoPcProvider>
    );
}