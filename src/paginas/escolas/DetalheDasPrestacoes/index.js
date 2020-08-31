import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {DetalheDasPrestacoes} from "../../../componentes/escolas/PrestacaoDeContas/DetalheDasPrestacoes";


export const DetalhedasPrestacoesPage = () => {
    return (
        <PaginasContainer>
            <div className="page-content-inner pt-0">
                <DetalheDasPrestacoes/>
            </div>
        </PaginasContainer>
    )
};