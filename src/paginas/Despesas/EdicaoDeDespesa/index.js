import React from "react";

import {PaginasContainer} from "../../PaginasContainer";

import {useParams} from 'react-router-dom'

export const EdicaoDeDespesa = ()=>{

    let {associacao} = useParams();


    return(
        <PaginasContainer>

            <h1 className="titulo-itens-painel mt-5">Edição de Despesa</h1>
            <div className="page-content-inner ">

            </div>
        </PaginasContainer>
    )

}