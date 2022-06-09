import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {SuporteAsUnidades} from "../../../componentes/Globais/SuporteAsUnidades"

export const SuporteAsUnidadesSme = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Suporte às unidades da SME</h1>
            <div className="page-content-inner">
                <SuporteAsUnidades visao={"SME"}/>
            </div>
        </PaginasContainer>
    )
};
