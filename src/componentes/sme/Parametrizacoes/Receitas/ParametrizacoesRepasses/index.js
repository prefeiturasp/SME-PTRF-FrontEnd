import React from "react";
import { RepassesProvider } from "./context/Repasse";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import {UrlsMenuInterno} from "./UrlsMenuInterno";

import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Filtros } from "./components/Filtros";
import { Paginacao } from "./components/Paginacao";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";


export const ParametrizacoesRepasses = () => {
    return (
        <RepassesProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Repasses</h1>
                <div className="page-content-inner">
                    <AbasPorRecurso
                        extra_abas={UrlsMenuInterno}
                    />

                    <TopoComBotoes/>
                    <Filtros/>
                    <Lista/>
                    <Paginacao/>
                </div>
            </PaginasContainer>
        </RepassesProvider>   
    )
}