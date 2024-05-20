import React, {useCallback, useEffect, useMemo, useState} from "react";
import { RepassesProvider } from "./context/Repasse";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import {UrlsMenuInterno} from "./UrlsMenuInterno";
import { MenuInterno } from "../../../../Globais/MenuInterno";

import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Filtros } from "./components/Filtros";
import { Paginacao } from "./components/Paginacao";


export const ParametrizacoesRepasses = () => {
    return (
        <RepassesProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Repasses</h1>
                <div className="page-content-inner">
                    <MenuInterno
                        caminhos_menu_interno={UrlsMenuInterno}
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