import React, {useState} from 'react'

import {Cabecalho} from './Cabecalho'
import {BotoesAvancarRetroceder} from "../AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/BotoesAvancarRetroceder"
import {TrilhaDeStatus} from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/TrilhaDeStatus"
import {ResponsavelAnalise} from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/ResponsavelAnalise"
import ConferenciaDeDocumentos from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/ConferenciaDeDocumentos"
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {ModalBootstrapReabreDREDiarioOficial} from "../../../Globais/ModalBootstrap"
import {deleteReabreConsolidadoDRE} from "../../../../services/sme/PrestacaoDeConta.service"

import "./../../../dres/PrestacaoDeContas/prestacao-de-contas.scss"
import { useParams } from 'react-router-dom'

export const AcompanhamentoDeRelatorioConsolidadoSMEDetalhe = () => {
    const params = useParams()
    const [relatorioConsolidado, setRelatorioConsolidado] = useState({});
    const [isShowModal, setIsShowModal] = useState(false);
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

    const handleRetroceder = (status_sme) => {
        setIsShowModal(true)
    }

    const handleReabreConsolidado =  async () => {
        const {consolidado_dre_uuid} = params
        await deleteReabreConsolidadoDRE(consolidado_dre_uuid)
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento da documentação da DRE</h1>
            <div className="page-content-inner">
                <Cabecalho />
                <BotoesAvancarRetroceder
                    relatorios={relatorioMocked}
                    metodoRetroceder={handleRetroceder}
                    textoBtnAvancar={"Analisar"}
                    textoBtnRetroceder={"Reabrir para DRE"}
                />
                <TrilhaDeStatus relatorioConsolidado={relatorioMocked}/>
                <ResponsavelAnalise responsavei={''}/>
                <ConferenciaDeDocumentos
                    relatorioConsolidado={relatorioConsolidado}
                />
            </div>
            <ModalBootstrapReabreDREDiarioOficial
                show={isShowModal}
                titulo={'Reabrir relatório consolidado para DRE'}
                bodyText={'Atenção, o relatório consolidado será reaberto para a DRE que poderá fazer alteração e precisará gerá-lo novamente.'}
                primeiroBotaoTexto={'Cancelar'}
                segundoBotaoTexto={'Confirmar'}
                segundoBotaoOnclick={handleReabreConsolidado}
                primeiroBotaoOnclick={(e) => setIsShowModal(false)}
            />

        </PaginasContainer>
    )
}