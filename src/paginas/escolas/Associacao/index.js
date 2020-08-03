import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {DadosDaAsssociacao} from "../../../componentes/escolas/Associacao/DadosDaAssociacao";


export const DadosDaAssociacaoPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Dados da Associação</h1>
            <div className="page-content-inner">
                <DadosDaAsssociacao/>
            </div>
        </PaginasContainer>
    )
};