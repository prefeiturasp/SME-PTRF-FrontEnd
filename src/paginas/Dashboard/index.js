import React from "react";
import {PaginasContainer} from "../PaginasContainer";
import {Dashboard} from "../../componentes/Dashborard";

export const DashboardPage = () => {

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Painel</h1>
            <h2 className="subtitulo-itens-painel-out">Ações recebidas no período: 20/10/2019 até 04/05/2020</h2>
            <div className="page-content-inner bg-transparent p-0">
                <Dashboard/>
            </div>
        </PaginasContainer>
    );
}