import React from "react";
import "./motivosRejeicao.scss"

import { MotivosRejeicaoProvider } from "./context/MotivosRejeicao";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { Filtros } from "./components/Filtros";
import { ExibicaoQuantidade } from "./components/ExibicaoQuantidade";
import { Lista } from "./components/Lista";
import { Paginacao } from "./components/Paginacao";

export const MotivosRejeicaoEncerramentoConta = () => {
    return (
        <MotivosRejeicaoProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Motivos Rejeição (encerramento conta)</h1>
                <div className="page-content-inner">
                    <TopoComBotoes/>
                    <Filtros/>
                    <ExibicaoQuantidade/>
                    <Lista/>
                    <Paginacao/>
                </div>
            </PaginasContainer>
        </MotivosRejeicaoProvider>
    )
}