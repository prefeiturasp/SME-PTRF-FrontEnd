import React from "react";
import {PaginasContainer} from '../../../PaginasContainer'
import {PainelParametrizacoes} from '../../../../componentes/sme/PainelParametrizacoes'

export const PainelParametrizacoesPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Painel de Parametrizações</h1>
            <div className="page-content-inner">
                <PainelParametrizacoes/>
            </div>
        </PaginasContainer>
    )
};