import React, { useState } from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {PrestacaoDeContas} from "../../../componentes/escolas/PrestacaoDeContas";
import "../../../componentes/escolas/PrestacaoDeContas/prestacao-de-contas.scss"
import {InformacoesIniciais} from "../../../componentes/escolas/PrestacaoDeContas/InformacoesIniciais";
import { PresidenteAusente } from "../../../componentes/escolas/PrestacaoDeContas/PresidenteAusente";

export const PrestacaoDeContasPage = () => {
    const [statusPC, setStatusPC] = useState({})

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5 mb-4">Prestação de contas</h1>
            <InformacoesIniciais/>
            <PresidenteAusente
                statusPC={statusPC}
            />
            <div className="page-content-inner pt-0">
                <PrestacaoDeContas
                    setStatusPC={setStatusPC}
                />
            </div>
        </PaginasContainer>
    )
};