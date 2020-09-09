import React from 'react'
import {PaginasContainer} from '../PaginasContainer'
import {Dashboard} from '../../componentes/Globais/Dashborard'

export const DashboardPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Resumo dos Recursos</h1>
            <div className="page-content-inner">
                <Dashboard/>
            </div>
        </PaginasContainer>
    )
};
