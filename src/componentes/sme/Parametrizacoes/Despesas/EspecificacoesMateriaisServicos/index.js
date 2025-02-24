import React from "react";

import { MateriaisServicosProvider } from "./context//MateriaisServicos";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { UrlsMenuInterno } from "./UrlsMenuInterno";
import { MenuInterno } from "../../../../Globais/MenuInterno";

import { TopoComBotoes } from "./components/TopoComBotoes"
import { Lista } from "./components/Lista"
import { Filtros } from "./components/Filtros"
import { Paginacao } from "./components/Paginacao"

export const EspecificacoesMateriaisServicos = () => {

    return (
        <MateriaisServicosProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Especificações de Materiais e Serviços</h1>
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
        </MateriaisServicosProvider>
    )
}
