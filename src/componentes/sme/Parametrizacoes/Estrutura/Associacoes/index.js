import React from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";

import {TabelaAssociacoes} from "./components/TabelaAssociacoes";
import { Filtros } from "./components/Filtros";
import {BtnAddAssociacoes} from "./components/BtnAddAssociacoes";

import {UrlsMenuInterno} from "./UrlsMenuInterno";
import {MenuInterno} from "../../../../Globais/MenuInterno";
import { AssociacaoListagemProvider } from "./context/AssociacaoListagem";

export const Associacoes = () => {
    return(
        <AssociacaoListagemProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Associações</h1>

                <div className="page-content-inner">
                    <MenuInterno
                        caminhos_menu_interno={UrlsMenuInterno}
                    />

                    <BtnAddAssociacoes />

                    <Filtros />

                    <TabelaAssociacoes />
                </div>
            </PaginasContainer>
        </AssociacaoListagemProvider>
    )
};
