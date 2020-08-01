import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {Associacoes} from "../../../componentes/dres/Associacoes";


export const AssociacoesPage = () =>{

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Consulta por Associações</h1>
            <div className="page-content-inner">
                <Associacoes/>
            </div>
        </PaginasContainer>
    )

}