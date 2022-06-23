import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {ExtracaoDados} from "../../../componentes/sme/ExtracaoDados";


export const ExtracaoDadosPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Extração de dados do sistema</h1>
            <div className="page-content-inner">
                <ExtracaoDados/>
            </div>
        </PaginasContainer>
    )
};