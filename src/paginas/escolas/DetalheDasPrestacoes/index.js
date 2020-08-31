import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {DetalheDasPrestacoes} from "../../../componentes/escolas/PrestacaoDeContas/DetalheDasPrestacoes";


export const DetalhedasPrestacoesPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5 mb-4">Conciliação Bancária</h1>
            <div className="page-content-inner pt-0">
                <DetalheDasPrestacoes/>
            </div>
        </PaginasContainer>
    )
};