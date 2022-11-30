import React, {useEffect, useState, useCallback} from 'react'
import { useParams, useHistory } from 'react-router-dom'

import {Cabecalho} from './Cabecalho'
import {BotoesAvancarRetroceder} from "./BotoesAvancarRetroceder"
import {TrilhaDeStatus} from "./TrilhaDeStatus"
import ResponsavelAnalise from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/ResponsavelAnalise"
import ConferenciaDeDocumentos from "../../AcompanhamentoRelatoriosConsolidadosSME/AcompanhamentoDeRelatorioConsolidadoSMEDetalhe/ConferenciaDeDocumentos"
import Comentarios from './Comentarios'
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {ModalBootstrapDetalhamentoDREDiarioOficial} from "../../../Globais/ModalBootstrap"
import {deleteReabreConsolidadoDRE, postMarcarComoPublicadoNoDiarioOficial, postMarcarComoAnalisado} from "../../../../services/sme/AcompanhamentoSME.service"
import {detalhamentoConsolidadoDRE} from "../../../../services/sme/AcompanhamentoSME.service"
import { getTodosOsResponsaveis, postAnalisarRelatorio } from '../../../../services/sme/AcompanhamentoSME.service'
import moment from "moment";
import {toastCustom} from "../../../Globais/ToastCustom";
import Loading from "../../../../utils/Loading";

import "./../../../dres/PrestacaoDeContas/prestacao-de-contas.scss"
import DevolucaoParaAcertos from "./DevolucaoParaAcertos";

export const AcompanhamentoDeRelatorioConsolidadoSMEDetalhe = () => {
    const params = useParams()
    const history = useHistory()
    const [relatorioConsolidado, setRelatorioConsolidado] = useState({});
    const [isShowModalReabrirParaDre, setIsShowModalReabrirParaDre] = useState(false);
    const [isShowModalVoltarParaPublicado, setIsShowModalVoltarParaPublicado] = useState(false);
    const [isShowModalConcluirAnalise, setIsShowModalConcluirAnalise] = useState(false);
    const [isShowModalVoltarParaAnalise, setIsShowModalVoltarParaAnalise] = useState(false);
    const [disabledBtnAvancar, setDisabledBtnAvancar] = useState(true);
    const [disabledBtnRetroceder, setDisabledBtnRetroceder] = useState(true);
    const [loading, setLoading] = useState(true);
    const [todosOsResponsaveisAutoComplete, setTodosOsResponsaveisAutoComplete] = useState([]);
    const [selectedResponsavel, setSelectedResponsavel] = useState(null);
    const [habilitaVerResumoComentariosNotificados, setHabilitaVerResumoComentariosNotificados] = useState(false);
    const [habilitaVerResumoAcertoEmDocumento, setHabilitaVerResumoAcertoEmDocumento] = useState(false);

    const getConsolidadoDREUuid = useCallback(async () => {
        let {consolidado_dre_uuid} = params
        const response = await detalhamentoConsolidadoDRE(consolidado_dre_uuid)
        
        setRelatorioConsolidado(response.data);
        setLoading(false);
    }, [params]);
    
    useEffect(() => {
        getConsolidadoDREUuid()
    }, [getConsolidadoDREUuid])

    // UseEffect para controlar botoes
    useEffect(() => {
        if(relatorioConsolidado && relatorioConsolidado.uuid){
            if(relatorioConsolidado.status_sme === "NAO_PUBLICADO"){
                setDisabledBtnRetroceder(false);
            }
            else if(relatorioConsolidado.status_sme === "PUBLICADO"){
                setDisabledBtnAvancar(true);
            }
            if(relatorioConsolidado.status_sme === "EM_ANALISE"){
                setDisabledBtnAvancar(true);
                setDisabledBtnRetroceder(false);
            }
            if(relatorioConsolidado.status_sme === "ANALISADO"){
                setDisabledBtnAvancar(false);
                setDisabledBtnRetroceder(false);
            }
            if(relatorioConsolidado.status_sme === "DEVOLVIDO"){
                setDisabledBtnAvancar(false);
            }
        }
        
    }, [relatorioConsolidado])

    // useEffect para lidar com o campo responsavel (autocomplete)
    useEffect(() => {
        if(relatorioConsolidado && relatorioConsolidado.uuid){
            if(relatorioConsolidado.responsavel_pela_analise){
                let username = relatorioConsolidado.responsavel_pela_analise.username;
                let name = relatorioConsolidado.responsavel_pela_analise.name;
                let usuario = `${username} - ${name}`;
    
                let objeto_auto_complete = {
                    nome: name,
                    username: username,
                    usuario: usuario
                }
    
                setSelectedResponsavel(objeto_auto_complete);
                setDisabledBtnAvancar(false)
            }
            else{
                setSelectedResponsavel(null);
                setDisabledBtnAvancar(true)
            }
        }
    }, [relatorioConsolidado])

    const handleRetroceder = (relatorioConsolidado) => {
        if(relatorioConsolidado && relatorioConsolidado.status_sme === 'NAO_PUBLICADO'){
            setIsShowModalReabrirParaDre(true);
        }

        // O status "Publicado no diario oficial" não possui botão de retroceder

        if(relatorioConsolidado && relatorioConsolidado.status_sme === 'EM_ANALISE'){
            setIsShowModalVoltarParaPublicado(true);
        }

        if(relatorioConsolidado && relatorioConsolidado.status_sme === 'ANALISADO'){
            setIsShowModalVoltarParaAnalise(true);
        }
    }

    const handleAvancar = (relatorioConsolidado) => {
        // O status "Não publicado no diario oficial" não possui botão de avançar

        if(relatorioConsolidado && (relatorioConsolidado.status_sme === 'PUBLICADO')){
            handleAnalisarRelatorio();
        }

        if(relatorioConsolidado && (relatorioConsolidado.status_sme === 'DEVOLVIDO')){
            setIsShowModalVoltarParaAnalise(true);
        }

        if(relatorioConsolidado && (relatorioConsolidado.status_sme === 'EM_ANALISE')){
            setIsShowModalConcluirAnalise(true);
        }
    }

    const handleAnalisarRelatorio = async() => {
        setLoading(true);
        let payload = {
            consolidado_dre: relatorioConsolidado.uuid,
            usuario: selectedResponsavel.username
        }

        let response = await postAnalisarRelatorio(payload);
        if(response.status === 200){
            setIsShowModalVoltarParaAnalise(false);
            toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'O relatório consolidado foi alterado para “Em análise”.');
        }
        await getConsolidadoDREUuid();
    }

    const handleReabreConsolidado =  async () => {
        setIsShowModalReabrirParaDre(false)
        setDisabledBtnRetroceder(true);
        const {consolidado_dre_uuid} = params
        await deleteReabreConsolidadoDRE(consolidado_dre_uuid)
        history.push('/analises-relatorios-consolidados-dre/')
    }

    const handleVoltarParaPublicado =  async () => {
        setLoading(true);
        let payload = {
            consolidado_dre: relatorioConsolidado.uuid,
            data_publicacao: relatorioConsolidado.data_publicacao,
            pagina_publicacao: relatorioConsolidado.pagina_publicacao
        }

        let response = await postMarcarComoPublicadoNoDiarioOficial(payload);
        if(response.status === 200){
            setIsShowModalVoltarParaPublicado(false);
            toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'O relatório consolidado foi alterado para “Publicado no Diário Oficial”.');
        }
        await getConsolidadoDREUuid();
    }

    const handleConcluirAnalise =  async () => {
        setLoading(true);
        let payload = {
            consolidado_dre: relatorioConsolidado.uuid,
            usuario: selectedResponsavel.username
        }

        let response = await postMarcarComoAnalisado(payload);
        if(response.status === 200){
            setIsShowModalConcluirAnalise(false);
            toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A análise do relatório foi concluída.');
        }
        await getConsolidadoDREUuid();
    }

    const carregaTodosOsResponsaveis = useCallback(async () => {
        let todos_responsaveis = await getTodosOsResponsaveis();
        setTodosOsResponsaveisAutoComplete(todos_responsaveis);

    }, []);

    useEffect(() => {
        carregaTodosOsResponsaveis();
    }, [carregaTodosOsResponsaveis]);

    const recebeResponsavelAutoComplete = (value) => {
        if(value){
            setSelectedResponsavel(value);
        }
        else{
            setSelectedResponsavel(null);
        }
    }

    const formataDataInicioAnalise = (data_inicio_analise) => {
        let data = moment(data_inicio_analise, "YYYY-MM-DD").format("DD/MM/YYYY");
        return data;
    }

    const handleOnChangeResponsavelAnalise = (value) => {
        setSelectedResponsavel(value);

        if(value && value.username){
            setDisabledBtnAvancar(false);
        }
        else{
            setDisabledBtnAvancar(true);
        }
    }   

    const disableResponsavelAnalise = (relatorioConsolidado) => {
        if(relatorioConsolidado){
            if(relatorioConsolidado.status_sme === "NAO_PUBLICADO" || relatorioConsolidado.status_sme === "ANALISADO"){
                return true;
            }    
        }

        return false;
    }

    const disableBtnVerResumo = () => {
        let disabled = true
        if(habilitaVerResumoAcertoEmDocumento){
            disabled = false;
        }
        if(habilitaVerResumoComentariosNotificados){
            disabled = false;
        }

        if (["NAO_PUBLICADO", "PUBLICADO"].includes(relatorioConsolidado.status_sme)){
            disabled =  true;
        }

        return disabled
    }

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento da documentação da DRE</h1>
            {loading 
            ?
                (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) 
            :
                <>
                    <div className="page-content-inner">
                        <Cabecalho relatorioConsolidado={relatorioConsolidado}/>
                        <BotoesAvancarRetroceder
                            relatorioConsolidado={relatorioConsolidado}
                            metodoAvancar={handleAvancar}
                            metodoRetroceder={handleRetroceder}
                            disabledBtnAvancar={disabledBtnAvancar}
                            disabledBtnRetroceder={disabledBtnRetroceder}
                        />
                        <TrilhaDeStatus relatorioConsolidado={relatorioConsolidado}/>
                        <ResponsavelAnalise
                            selectedResponsavel={selectedResponsavel}
                            todosOsResponsaveisAutoComplete={todosOsResponsaveisAutoComplete}
                            recebeResponsavelAutoComplete={recebeResponsavelAutoComplete}
                            relatorioConsolidado={relatorioConsolidado}
                            formataDataInicioAnalise={formataDataInicioAnalise}
                            disableResponsavelAnalise={disableResponsavelAnalise}
                            handleOnChangeResponsavelAnalise={handleOnChangeResponsavelAnalise}
                        />
                        <ConferenciaDeDocumentos
                            relatorioConsolidado={relatorioConsolidado}
                            setHabilitaVerResumoAcertoEmDocumento={setHabilitaVerResumoAcertoEmDocumento}
                            getConsolidadoDREUuid={getConsolidadoDREUuid}
                            refreshConsolidado={getConsolidadoDREUuid}
                        />
                        <DevolucaoParaAcertos relatorioConsolidado={relatorioConsolidado} refreshConsolidado={getConsolidadoDREUuid} disableBtnVerResumo={disableBtnVerResumo} setLoading={setLoading}/>
                        <Comentarios
                            relatorioConsolidado={relatorioConsolidado}
                            setHabilitaVerResumoComentariosNotificados={setHabilitaVerResumoComentariosNotificados}
                        />
                    </div>
                    
                    <section>
                        <ModalBootstrapDetalhamentoDREDiarioOficial
                            show={isShowModalReabrirParaDre}
                            titulo={'Reabrir relatório consolidado para DRE'}
                            bodyText={'Atenção, o relatório consolidado será reaberto para a DRE que poderá fazer alteração e precisará gerá-lo novamente.'}
                            primeiroBotaoTexto={'Cancelar'}
                            segundoBotaoTexto={'Confirmar'}
                            segundoBotaoOnclick={handleReabreConsolidado}
                            primeiroBotaoOnclick={() => setIsShowModalReabrirParaDre(false)}
                        />
                    </section>

                    <section>
                        <ModalBootstrapDetalhamentoDREDiarioOficial
                            show={isShowModalVoltarParaPublicado}
                            titulo={'Voltar para publicado no D.O'}
                            bodyText={'Deseja retornar o relatório consolidado para o status de Publicado no D.O?'}
                            primeiroBotaoTexto={'Cancelar'}
                            segundoBotaoTexto={'Confirmar'}
                            segundoBotaoOnclick={handleVoltarParaPublicado}
                            primeiroBotaoOnclick={() => setIsShowModalVoltarParaPublicado(false)}
                        />
                    </section>

                    <section>
                        <ModalBootstrapDetalhamentoDREDiarioOficial
                            show={isShowModalConcluirAnalise}
                            titulo={'Concluir análise'}
                            bodyText={'Você tem certeza que deseja concluir essa análise?'}
                            primeiroBotaoTexto={'Cancelar'}
                            segundoBotaoTexto={'Confirmar'}
                            segundoBotaoOnclick={handleConcluirAnalise}
                            primeiroBotaoOnclick={() => setIsShowModalConcluirAnalise(false)}
                        />
                    </section>

                    <section>
                        <ModalBootstrapDetalhamentoDREDiarioOficial
                            show={isShowModalVoltarParaAnalise}
                            titulo={'Voltar para em análise'}
                            bodyText={'Deseja retornar o relatório consolidado para o status de Em análise?'}
                            primeiroBotaoTexto={'Cancelar'}
                            segundoBotaoTexto={'Confirmar'}
                            segundoBotaoOnclick={handleAnalisarRelatorio}
                            primeiroBotaoOnclick={() => setIsShowModalVoltarParaAnalise(false)}
                        />
                    </section>
                </>
            }

        </PaginasContainer>
    )
}