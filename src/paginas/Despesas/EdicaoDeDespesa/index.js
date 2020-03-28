import React from "react";
import {Despesa} from "../../../componentes/Formularios/Despesa";
import {PaginasContainer} from "../../PaginasContainer";

export const EdicaoDeDespesa = ()=>{

    return(
        <PaginasContainer>

            <h1 className="titulo-itens-painel mt-5">Edição de Despesa</h1>
            <div className="page-content-inner ">
                <Despesa/>
            </div>
        </PaginasContainer>
    )

}