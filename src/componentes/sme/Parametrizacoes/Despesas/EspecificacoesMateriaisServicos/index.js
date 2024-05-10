import React from "react";

import {MateriaisServicosProvider} from "./context//MateriaisServicos";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {MenuInterno} from "../../../../Globais/MenuInterno";

export const EspecificacoesMateriaisServicos = () => {
    const UrlsMenuInterno = [
        {label: "Dados especificações de Materiais e Serviços", url: "parametro-especificacoes"},
        {label: "Cargas de arquivo", url: "parametro-arquivos-de-carga", origem:'CARGA_MATERIAIS_SERVICOS'},
    ];

    return (
        <MateriaisServicosProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Especificações de Materiais e Serviços</h1>
                <div className="page-content-inner">
                    <MenuInterno
                        caminhos_menu_interno={UrlsMenuInterno}
                    />
                </div>
            </PaginasContainer>
        </MateriaisServicosProvider>
    )
}