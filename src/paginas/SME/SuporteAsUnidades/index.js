import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {SuporteAsUnidades} from "../../../componentes/Globais/SuporteAsUnidades"

export const SuporteAsUnidadesSme = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5 mb-4">Suporte às unidades</h1>
            <SuporteAsUnidades visao={"SME"}/>
        </PaginasContainer>
    )
};
