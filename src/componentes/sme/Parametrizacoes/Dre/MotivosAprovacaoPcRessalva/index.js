import React from "react";
import { MotivosAprovacaoPcRessalvaProvider } from "./context/MotivosAprovacaoPcRessalva";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Paginacao } from "./components/Paginacao";
import { Filtros } from "./components/Filtros";
import { ExibicaoQuantidade } from "./components/ExibicaoQuantidade";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";



export const ParametrizacoesMotivosAprovacaoPcRessalva = () => {
    return (
        <MotivosAprovacaoPcRessalvaProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Motivos de aprovação de PC com ressalvas</h1>
                <div className="page-content-inner">
                    <AbasPorRecurso />

                    <TopoComBotoes/>

                    <Filtros/>
                    
                    <Lista/>
                    
                    <Paginacao/>
                </div>
            </PaginasContainer>
        </MotivosAprovacaoPcRessalvaProvider>   
    )
}