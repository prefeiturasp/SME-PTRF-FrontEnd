import React, {useEffect, useState, useCallback} from 'react'
import { useParams, useHistory } from 'react-router-dom'

import {Cabecalho} from './Cabecalho'
import {BotoesAvancarRetroceder} from "../AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/BotoesAvancarRetroceder"
import {TrilhaDeStatus} from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/TrilhaDeStatus"
import {ResponsavelAnalise} from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/ResponsavelAnalise"
import ConferenciaDeDocumentos from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/ConferenciaDeDocumentos"
import Comentarios from './Comentarios'
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {ModalBootstrapReabreDREDiarioOficial} from "../../../Globais/ModalBootstrap"
import {deleteReabreConsolidadoDRE} from "../../../../services/sme/PrestacaoDeConta.service"
import {detalhamentoConsolidadoDRE} from "../../../../services/sme/PrestacaoDeConta.service"
import { getTodosOsResponsaveis, postAnalisarRelatorio } from '../../../../services/sme/PrestacaoDeConta.service'
import moment from "moment";
import {toastCustom} from "../../../Globais/ToastCustom";


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
    const [todosOsResponsaveisAutoComplete, setTodosOsResponsaveisAutoComplete] = useState([]);
    const [responsavelAutocomplete, setResponsavelAutocomplete] = useState(null);
    const [textoBotaoAvancar, setTextoBotaoAvancar] = useState("")
    const [textoBotaoRetroceder, setTextoBotaoRetroceder] = useState("")
    
    const getConsolidadoDREUuid = useCallback(async () => {
        let {consolidado_dre_uuid} = params
        const response = await detalhamentoConsolidadoDRE(consolidado_dre_uuid)
        setDisabledBtnAvancar(response.data.exibe_analisar)
        setdisabledBtnRetroceder(response.data.exibe_reabrir_relatorio)
        setRelatorioConsolidado(response.data);

        if(response.data.responsavel_pela_analise){
            let username = response.data.responsavel_pela_analise.username;
            let name = response.data.responsavel_pela_analise.name;
            let responsavel = `${username} - ${name}`;
            setResponsavelAutocomplete(responsavel)
        }

    }, [params]);
    
    useEffect(() => {
        getConsolidadoDREUuid()
    }, [getConsolidadoDREUuid])

    useEffect(() => {
        if(relatorioConsolidado.status_sme === "NAO_PUBLICADO" || relatorioConsolidado.status_sme === "PUBLICADO"){
            setTextoBotaoAvancar("Analisar");
            setTextoBotaoRetroceder("Reabrir para DRE");
        }
        else if(relatorioConsolidado.status_sme === "EM_ANALISE"){
            setTextoBotaoAvancar("Concluir");
            setTextoBotaoRetroceder("Publicada no D.O");
        }
    }, [relatorioConsolidado])

    const handleRetroceder = () => {
        setIsShowModal(true)
    }

    const handleAvancar = (relatorioConsolidado) => {
        if(relatorioConsolidado && (relatorioConsolidado.status_sme === 'PUBLICADO')){
            analisarRelatorio(relatorioConsolidado);
        }
    }

    const analisarRelatorio = async(relatorioConsolidado) => {
        let payload = {
            consolidado_dre: relatorioConsolidado.uuid,
            usuario: responsavelAutocomplete.username
        }

        let response = await postAnalisarRelatorio(payload);
        if(response.status === 200){
            toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'O relatório consolidado foi alterado para “Em análise”.');
        }
        await getConsolidadoDREUuid();
    }

    const handleReabreConsolidado =  async () => {
        const {consolidado_dre_uuid} = params
        await deleteReabreConsolidadoDRE(consolidado_dre_uuid)
        setIsShowModal(false)
        history.push('/analises-relatorios-consolidados-dre/')
    }

    const carregaTodosOsResponsaveis = useCallback(async () => {
        let todos_responsaveis = await getTodosOsResponsaveis();
        setTodosOsResponsaveisAutoComplete(todos_responsaveis);

    }, []);

    useEffect(() => {
        carregaTodosOsResponsaveis();
    }, [carregaTodosOsResponsaveis]);

    const recebeResponsavelAutoComplete = (selectResponsavel) => {
        if(selectResponsavel){
            setResponsavelAutocomplete(selectResponsavel);
        }
        else{
            setResponsavelAutocomplete(null);
        }
    }

    const formataDataInicioAnalise = (data_inicio_analise) => {
        let data = moment(data_inicio_analise, "YYYY-MM-DD").format("DD/MM/YYYY");
        return data;
    }

    const disableResponsavelAnalise = (relatorioConsolidado) => {
        if(relatorioConsolidado && relatorioConsolidado.status_sme === "PUBLICADO"){
            return false;
        }

        return true;
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
                    metodoAvancar={handleAvancar}
                    textoBtnAvancar={textoBotaoAvancar}
                    textoBtnRetroceder={textoBotaoRetroceder}
                    responsavelAutocomplete={responsavelAutocomplete}
                    
                />
                <TrilhaDeStatus relatorioConsolidado={relatorioConsolidado}/>
                <ResponsavelAnalise 
                    todosOsResponsaveisAutoComplete={todosOsResponsaveisAutoComplete}
                    recebeResponsavelAutoComplete={recebeResponsavelAutoComplete}
                    relatorioConsolidado={relatorioConsolidado}
                    formataDataInicioAnalise={formataDataInicioAnalise}
                    disableResponsavelAnalise={disableResponsavelAnalise}
                />
                <ConferenciaDeDocumentos
                    relatorioConsolidado={relatorioConsolidado}
                />
                <DevolucaoParaAcertos relatorioConsolidado={relatorioConsolidado} refreshConsolidado={getConsolidadoDREUuid} />
                <Comentarios
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