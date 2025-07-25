import React, {memo, useCallback, useContext, useEffect, useMemo, useState} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
// Hooks Personalizados
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import {TopoComBotaoVoltar} from "./TopoComBotaoVoltar";
import './consulta-detalhamento-analise-da-dre.scss'
import {getAnalisesDePcDevolvidas} from "../../../../services/dres/PrestacaoDeContas.service";
import TextoSuperior from "./TextoSuperior";
import CardsDevolucoesParaAcertoDaDre from "../../../Globais/CardsDevolucoesParaAcertoDaDre";
import ExibeAcertosEmLancamentosEDocumentosPorConta from "../../../Globais/ExibeAcertosEmLancamentosEDocumentosPorConta";
import {getPeriodoPorUuid} from "../../../../services/sme/Parametrizacoes.service";
import {exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {ModalConcluirAcertoPC} from "./../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ResumoDosAcertos/ModalConcluirAcertoPC"
import { AnaliseDREProvider } from "../../../../context/AnaliseDRE";

const ConsultaDetalhamentoAnaliseDaDre = () => {

    let {prestacao_conta_uuid} = useParams();
    const parametros = useLocation();
    const navigate = useNavigate();

    // Hooks Personalizados
    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacao_conta_uuid)
    const [analisesDePcDevolvidas, setAnalisesDePcDevolvidas] = useState([])
    const [openModalAcertos, setOpenModalAcertos] = useState(false)
    const [analiseAtualUuid, setAnaliseAtualUuid] = useState('')
    const [devolucaoAtualSelecionada, setDevolucaoAtualSelecionada] = useState(false)
    const [periodoFormatado, setPeriodoFormatado] = useState(null)

    const totalAnalisesDePcDevolvidas = useMemo(() => analisesDePcDevolvidas.length, [analisesDePcDevolvidas]);

    const scrollToLocation = useCallback(() => {
        const { hash } = window.location;
        if (hash !== '') {
            let retries = 0;
            const id = hash.replace('#', '');
            const scroll = () => {
                retries += 0;
                if (retries > 50) return;
                const element = document.getElementById(id);
                if (element) {
                    setTimeout(() => element.scrollIntoView(), 0);
                } else {
                    setTimeout(scroll, 100);
                }
            };
            scroll();
        }
    }, [])

    useEffect(() => {
        // if not a hash link, scroll to top
        if (parametros.hash === '') {
            window.scrollTo(0, 0);
        }
        // else scroll to id
        else {
            scrollToLocation()
        }
    }, [scrollToLocation, parametros]); // do this on route change


    useEffect(() => {
        let mounted = true;
        const carregaAnalisesDePcDevolvidas = async () => {
            if (mounted) {
                let analises_pc_devolvidas = await getAnalisesDePcDevolvidas(prestacao_conta_uuid)
                setAnalisesDePcDevolvidas(analises_pc_devolvidas)
            }
        }
        carregaAnalisesDePcDevolvidas()
        return () => {
            mounted = false;
        }
    }, [prestacao_conta_uuid])

    useEffect(() => {
        let mounted = true;

        const periodoFormatado = async () => {
            if(mounted){
                if(parametros && parametros.state && parametros.state.periodoFormatado){
                    setPeriodoFormatado(parametros.state.periodoFormatado);
                }
                else if(prestacaoDeContas && prestacaoDeContas.periodo_uuid){
                    let periodo = await getPeriodoPorUuid(prestacaoDeContas.periodo_uuid);
                    setPeriodoFormatado(retornaObjetoPeriodo(periodo));
                }
                else{
                    setPeriodoFormatado(null);
                }
            }
        }

        periodoFormatado();
        return () => {
            mounted = false;
        }

    }, [parametros, prestacaoDeContas]);

    const onClickVoltar = useCallback(() => {
        navigate('/analise-dre')
    }, [navigate])

    const exibeLabelStatus = (status) => {
        if (status === 'EM_ANDAMENTO') {
            return (<span className={`texto-legenda-cor-EM_ANDAMENTO`}><strong>em andamento</strong></span>)

        } else if (status === 'NAO_APRESENTADA') {
            return (<span className={`texto-legenda-cor-NAO_APRESENTADA`}><strong>não apresentada</strong></span>)

        } else if (status === 'NAO_RECEBIDA') {
            return (<span className={`texto-legenda-cor-NAO_RECEBIDA`}><strong>não recebida</strong></span>)

        } else if (status === 'RECEBIDA') {
            return (<span className={`texto-legenda-cor-RECEBIDA`}><strong>recebida</strong></span>)

        } else if (status === 'EM_ANALISE') {
            return (<span className={`texto-legenda-cor-EM_ANALISE`}><strong>em análise</strong></span>)

        } else if (status === 'DEVOLVIDA') {
            return (<span className={`texto-legenda-cor-DEVOLVIDA`}><strong>devolvida pela DRE</strong></span>)

        } else if (status === 'APROVADA') {
            return (<span className={`texto-legenda-cor-APROVADA`}><strong>aprovada</strong></span>)

        } else if (status === 'APROVADA_RESSALVA') {
            return (
                <span className={`texto-legenda-cor-APROVADA_RESSALVA`}><strong>aprovada com ressalva</strong></span>)

        } else if (status === 'REPROVADA') {
            return (<span className={`texto-legenda-cor-REPROVADA`}><strong>reprovada</strong></span>)
        }
    };

    const retornaTextoSuperior = () => {
        if (totalAnalisesDePcDevolvidas > 0){

            if (prestacaoDeContas.status === 'DEVOLVIDA'){
                return (
                    <p className='fonte-16 mt-1'>
                        Sua prestação de contas foi {exibeLabelStatus(prestacaoDeContas.status)} para os seguintes acertos:
                    </p>
                )
            }

            else if(prestacaoDeContas.status === 'EM_ANALISE'){
                return (
                    <p className='fonte-16 mt-1'>
                        Sua prestação de contas está {exibeLabelStatus(prestacaoDeContas.status)} pela DRE, contando com os seguintes acertos:
                    </p>
                )
            }

            else if(prestacaoDeContas.status === 'DEVOLVIDA_RETORNADA' || prestacaoDeContas.status === 'DEVOLVIDA_RECEBIDA'){
                return (
                    <p className='fonte-16 mt-1'>
                        Sua prestação de contas foi apresentada pela Associação, contando com os seguintes acertos:
                    </p>
                )
            }

            return (
                <p className='fonte-16 mt-1'>
                    Sua prestação de contas foi {exibeLabelStatus(prestacaoDeContas.status)} pela DRE, contando com os seguintes acertos:
                </p>
            )
        }else{
            return(
                <p className='fonte-16 mt-1'>
                    Sua prestação de contas foi {exibeLabelStatus(prestacaoDeContas.status)} pela DRE, sem devolução para acertos.
                </p>
            )
        }

    }

    const retornaObjetoPeriodo = (periodo) => {
        return {
            referencia: periodo.referencia ? periodo.referencia : '',
            data_inicio_realizacao_despesas: periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : '',
            data_fim_realizacao_despesas: periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : '',
        }
    }

    const podeAbrirModalAcertos = () => {
        setOpenModalAcertos(true)
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Análise DRE</h1>
            <div className="page-content-inner">
                <AnaliseDREProvider>
                    <TopoComBotaoVoltar
                        onClickVoltar={onClickVoltar}
                        periodoUuid={prestacaoDeContas.periodo_uuid}
                        periodoFormatado={periodoFormatado}
                        podeAbrirModalAcertos={podeAbrirModalAcertos}
                        prestacaoContaUuid={prestacao_conta_uuid}
                        statusPc={prestacaoDeContas.status}
                        devolucaoAtualSelecionada={devolucaoAtualSelecionada}
                    />
                    <TextoSuperior
                        retornaTextoSuperior={retornaTextoSuperior}
                        />

                    <hr className="mt-0 mb-0"/>
                    {totalAnalisesDePcDevolvidas > 0 &&
                        <>
                            <CardsDevolucoesParaAcertoDaDre
                                prestacao_conta_uuid={prestacao_conta_uuid}
                                setAnaliseAtualUuid={setAnaliseAtualUuid}
                                devolucao_atual={prestacaoDeContas.devolucao_atual}
                                setDevolucaoAtualSelecionada={setDevolucaoAtualSelecionada}
                            />
                            <ExibeAcertosEmLancamentosEDocumentosPorConta
                                prestacaoDeContasUuid={prestacao_conta_uuid}
                                analiseAtualUuid={analiseAtualUuid}
                                exibeBtnIrParaPaginaDeAcertos={false}
                                exibeBtnIrParaPaginaDeReceitaOuDespesa={true}
                            />
                        </>
                    }
                    <section>
                    <ModalConcluirAcertoPC
                        show={openModalAcertos}
                        handleClose={(e) => setOpenModalAcertos(false)}
                        titulo='Concluir acerto da Prestação de Contas'
                        texto={'Não é possível concluir o acerto da prestação de contas pois nem todos os acertos solicitados pela DRE foram realizados ou justificados. É necessário que você verifique os itens de acerto nos lançamentos/documentos não conferidos ou que estão conferidos parcialmente.'}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                    </section>
                </AnaliseDREProvider>
            </div>
        </PaginasContainer>
    )
}
export default memo(ConsultaDetalhamentoAnaliseDaDre)

