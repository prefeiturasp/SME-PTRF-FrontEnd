import React, {useCallback, useEffect, useMemo, useState} from "react";
import { MotivosDevolucaoTesouroProvider } from "./context/MotivosDevolucaoTesouro";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Paginacao } from "./components/Paginacao";
import { Filtros } from "./components/Filtros";
import { ExibicaoQuantidade } from "./components/ExibicaoQuantidade";


export const ParametrizacoesMotivosDevolucaoTesouro = () => {
    return (
        <MotivosDevolucaoTesouroProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Motivos de devolução ao tesouro</h1>
                <div className="page-content-inner">
                    <TopoComBotoes/>
                    <Filtros/>
                    <ExibicaoQuantidade/>
                    <Lista/>
                    <Paginacao/>
                </div>
            </PaginasContainer>
        </MotivosDevolucaoTesouroProvider>   
    )
}