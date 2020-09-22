import React from "react";
import { useParams } from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";

export const ListaPrestacaoDeContas= () => {
    let {periodo_uuid, status_prestacao} = useParams();

    console.log("useParams periodo_uuid ", periodo_uuid)
    console.log("useParams status_prestacao ", status_prestacao)

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <h1>Lista Prestação de contas Componente</h1>
            </div>
        </PaginasContainer>
    )
};