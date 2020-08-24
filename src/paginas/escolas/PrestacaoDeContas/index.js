import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {PrestacaoDeContas} from "../../../componentes/escolas/PrestacaoDeContas";
import "../../../componentes/escolas/PrestacaoDeContas/prestacao-de-contas.scss"
import {InformacoesIniciais} from "../../../componentes/escolas/PrestacaoDeContas/InformacoesIniciais";


export const PrestacaoDeContasPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5 mb-4">Prestação de contas</h1>
            <InformacoesIniciais/>
            <div className="page-content-inner pt-0">
                <PrestacaoDeContas/>
            </div>
        </PaginasContainer>
    )
};