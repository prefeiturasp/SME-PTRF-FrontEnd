import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {RegularidadeAssociacoes} from "../../../componentes/dres/RegularidadeAssociacoes";

export const RegularidadeAssociacoesPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Regularidade das Associações</h1>
            <div className="page-content-inner">
                <RegularidadeAssociacoes/>
            </div>
        </PaginasContainer>
    )
};