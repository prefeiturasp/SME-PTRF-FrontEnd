import React from "react";
import {PaginasContainer} from '../../PaginasContainer'
import {RelatorioConsolidado} from "../../../componentes/dres/RelatorioConsolidado";

export const RelatorioConsolidadoPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Relatório consolidado</h1>
            <RelatorioConsolidado/>
        </PaginasContainer>
    )
};