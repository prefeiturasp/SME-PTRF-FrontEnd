import React, { useState } from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {PrestacaoDeContas} from "../../../componentes/escolas/PrestacaoDeContas";
import "../../../componentes/escolas/PrestacaoDeContas/prestacao-de-contas.scss"
import {InformacoesIniciais} from "../../../componentes/escolas/PrestacaoDeContas/InformacoesIniciais";
import { PresidenteAusente } from "../../../componentes/escolas/PrestacaoDeContas/PresidenteAusente";
import { BarraAvisoErroProcessamentoPC } from "../../../componentes/escolas/PrestacaoDeContas/BarraAvisoErroProcessamentoPC";

export const PrestacaoDeContasPage = () => {
    const [statusPC, setStatusPC] = useState({})
    const [registroFalhaGeracaoPc, setRegistroFalhaGeracaoPc] = useState(false);
    const [apresentaBarraAvisoErroProcessamentoPc, setApresentaBarraAvisoErroProcessamentoPc] = useState(false);

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5 mb-4">Prestação de contas</h1>
            <InformacoesIniciais/>
            <PresidenteAusente
                statusPC={statusPC}
            />
            {apresentaBarraAvisoErroProcessamentoPc && <BarraAvisoErroProcessamentoPC 
                registroFalhaGeracaoPc={registroFalhaGeracaoPc}
            />}
            <div className="page-content-inner pt-0">
                <PrestacaoDeContas
                    setStatusPC={setStatusPC}
                    registroFalhaGeracaoPc={registroFalhaGeracaoPc} 
                    setRegistroFalhaGeracaoPc={setRegistroFalhaGeracaoPc}
                    setApresentaBarraAvisoErroProcessamentoPc={setApresentaBarraAvisoErroProcessamentoPc}
                />
            </div>
        </PaginasContainer>
    )
};