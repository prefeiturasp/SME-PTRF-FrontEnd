import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {SuporteAsUnidades} from "../../../componentes/Globais/SuporteAsUnidades"


export const SuporteAsUnidadesDre = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Suporte às unidades da DRE</h1>
            <div className="page-content-inner">
                <SuporteAsUnidades visao={"DRE"}/>
            </div>
        </PaginasContainer>
    )
};