import React from "react";
import {PaginasContainer} from "../PaginasContainer";
import {GestaoDePerfis} from "../../componentes/Globais/GestaoDePerfis";


export const GestaoDePerfisPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Gestao De Perfis</h1>
            <div className="page-content-inner">
                <GestaoDePerfis/>
            </div>
        </PaginasContainer>
    )
};