import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {MeusDados} from "../../../componentes/escolas/MeusDados";

export const MeusDadosPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5 mb-4">Meus Dados</h1>
            <div className="page-content-inner pt-0">
                <MeusDados/>
            </div>
        </PaginasContainer>
    )
};