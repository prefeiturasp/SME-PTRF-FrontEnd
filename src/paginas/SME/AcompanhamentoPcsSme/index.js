import React from "react";
import {PaginasContainer} from '../../PaginasContainer'
import {AcompanhamentoPcsSme} from "../../../componentes/sme/AcompanhamentoPcsSme";

export const AcompanhamentoPcsSmePage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <AcompanhamentoPcsSme/>
            </div>
        </PaginasContainer>
    )
};