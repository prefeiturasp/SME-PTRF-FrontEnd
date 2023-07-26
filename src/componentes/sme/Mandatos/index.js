import React from "react";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {TopoComBotoes} from "./components/TopoComBotoes";
import {Filtros} from "./components/Filtros";
import "./mandato.scss"
import {ExibicaoQuantidade} from "./components/ExibicaoQuantidade";
import {Lista} from "./components/Lista";
import {MandatosProvider} from "./context/Mandatos";
import {Paginacao} from "./components/Paginacao";

export const Mandatos = () => {
    return (
        <MandatosProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Período de mandato</h1>
                <div className="page-content-inner">
                    <TopoComBotoes/>
                    <Filtros/>
                    <ExibicaoQuantidade/>
                    <Lista/>
                    <Paginacao/>
                </div>
            </PaginasContainer>
        </MandatosProvider>
    )
}