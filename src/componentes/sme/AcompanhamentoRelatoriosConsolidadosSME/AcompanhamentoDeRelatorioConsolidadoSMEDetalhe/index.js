import React, {useEffect, useState} from 'react'
import { useParams, useHistory } from 'react-router-dom'

import {Cabecalho} from './Cabecalho'
import {BotoesAvancarRetroceder} from "../AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/BotoesAvancarRetroceder"
import {TrilhaDeStatus} from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/TrilhaDeStatus"
import {ResponsavelAnalise} from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/ResponsavelAnalise"
import ConferenciaDeDocumentos from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/ConferenciaDeDocumentos"
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {ModalBootstrapReabreDREDiarioOficial} from "../../../Globais/ModalBootstrap"
import {deleteReabreConsolidadoDRE} from "../../../../services/sme/PrestacaoDeConta.service"
import {detalhamentoConsolidadoDRE} from "../../../../services/sme/PrestacaoDeConta.service"

import "./../../../dres/PrestacaoDeContas/prestacao-de-contas.scss"
import DevolucaoParaAcertos from "./DevolucaoParaAcertos";

export const AcompanhamentoDeRelatorioConsolidadoSMEDetalhe = () => {
    const params = useParams()
    const history = useHistory()
    const [relatorioConsolidado, setRelatorioConsolidado] = useState({});
    const [isShowModal, setIsShowModal] = useState(false);
    const [disabledBtnAvancar, setDisabledBtnAvancar] = useState(false);
    const [disabledBtnRetroceder, setdisabledBtnRetroceder] = useState(false);
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        getConsolidadoDREUuid()
    }, [])

    const getConsolidadoDREUuid = async () => {
        let {consolidado_dre_uuid} = params
        const response = await detalhamentoConsolidadoDRE(consolidado_dre_uuid)
        setDisabledBtnAvancar(response.data.exibe_analisar)
        setdisabledBtnRetroceder(response.data.exibe_reabrir_relatorio)
        setRelatorioConsolidado(response.data);
    }

    const handleRetroceder = () => {
        setIsShowModal(true)
    }

    const handleReabreConsolidado =  async () => {
        const {consolidado_dre_uuid} = params
        await deleteReabreConsolidadoDRE(consolidado_dre_uuid)
        setIsShowModal(false)
        history.push('/analises-relatorios-consolidados-dre/')
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento da documentação da DRE</h1>
            <div className="page-content-inner">
                <Cabecalho relatorioConsolidado={relatorioConsolidado}/>
                <BotoesAvancarRetroceder
                    relatorioConsolidado={relatorioConsolidado}
                    disabledBtnAvancar={disabledBtnAvancar}
                    disabledBtnRetroceder={disabledBtnRetroceder}
                    metodoRetroceder={handleRetroceder}
                    textoBtnAvancar={"Analisar"}
                    textoBtnRetroceder={"Reabrir para DRE"}
                />
                <TrilhaDeStatus relatorioConsolidado={relatorioConsolidado}/>
                <ResponsavelAnalise responsavei={''}/>
                <ConferenciaDeDocumentos
                    relatorioConsolidado={relatorioConsolidado}
                />
                <DevolucaoParaAcertos relatorioConsolidado={relatorioConsolidado} refreshConsolidado={getConsolidadoDREUuid} />
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