import React from "react";
import {PaginasContainer} from "../PaginasContainer";
import {MembrosDaAssociacao} from "../../componentes/Associacao/Membros";


export const MembrosDaAssociacaoPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Membros</h1>
            <div className="page-content-inner">
                <MembrosDaAssociacao/>
            </div>
        </PaginasContainer>
    )
};