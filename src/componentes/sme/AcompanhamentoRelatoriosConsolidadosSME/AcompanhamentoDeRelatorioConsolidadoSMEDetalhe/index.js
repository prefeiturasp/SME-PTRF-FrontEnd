import React, {useState} from 'react'

import {Cabecalho} from './Cabecalho'
// import Loading from "../../../../utils/Loading";
// import {useParams, Redirect, useLocation} from "react-router-dom";
import {BotoesAvancarRetroceder} from "../AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/BotoesAvancarRetroceder"
import {TrilhaDeStatus} from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/TrilhaDeStatus"
import {PaginasContainer} from "../../../../paginas/PaginasContainer";

export const AcompanhamentoDeRelatorioConsolidadoSMEDetalhe = () => {
    const [relatorioConsolidado, setRelatorioConsolidado] = useState({});
    const [loading, setLoading] = useState(false)

    const relatorioMocked = {
        "uuid": "d93bec41-c2fa-487b-b3c8-65d3f4080f7f",
        "dre": {
            "uuid": "6b33aec6-74d0-41eb-9057-17428db0e533",
            "codigo_eol": "108700",
            "tipo_unidade": "DRE",
            "nome": "DIRETORIA REGIONAL DE EDUCACAO ITAQUERA",
            "sigla": "IQ"
        },
        "periodo": {
            "uuid": "5fdc26ab-3161-44ac-8c8c-c7269b7610d1",
            "referencia": "2022.1",
            "data_inicio_realizacao_despesas": "2022-01-01",
            "data_fim_realizacao_despesas": "2022-12-31",
            "referencia_por_extenso": "1° repasse de 2022"
        },
        "status": "GERADOS_PARCIAIS",
        "versao": "FINAL",
        "status_sme": "NAO PUBLICADA NO D.O",
        "data_publicacao": "2022-10-10",
        "pagina_publicacao": "1",
        "sequencia_de_publicacao": 3,
        "tipo_relatorio": "Parcial #3",
        "exibe_reabrir_relatorio": false,
        "exibe_analisar": true,
        "permite_edicao": false
        }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento da documentação da DRE</h1>
            <div className="page-content-inner">
                <Cabecalho />
                <BotoesAvancarRetroceder
                    relatorios={relatorioMocked}
                    textoBtnAvancar={"Analisar"}
                    textoBtnRetroceder={"Reabrir para DRE"}
                />
                <TrilhaDeStatus relatorioConsolidado={relatorioMocked}/>
            </div>
        </PaginasContainer>
    )
}