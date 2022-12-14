import React from "react";
import {PaginasContainer} from '../../../PaginasContainer'
import { useParams, useLocation } from "react-router-dom"
import {AcompanhamentoPcsSmePorDre} from "../../../../componentes/sme/AcompanhamentoPcsSmePorDre";

export const AcompanhamentoPcsPorDre = () => {
    let { periodo_uuid, dre_uuid } = useParams();
    const { state } = useLocation();

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <AcompanhamentoPcsSmePorDre
                    dre_uuid={dre_uuid}
                    periodo_uuid={periodo_uuid}
                    nomeDre={state.nome_dre}
                />
            </div>
        </PaginasContainer>
    )
};