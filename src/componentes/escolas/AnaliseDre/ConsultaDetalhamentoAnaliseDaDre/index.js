import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {useParams, useLocation, useHistory} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
// Hooks Personalizados
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import {TopoComBotaoVoltar} from "./TopoComBotaoVoltar";
import './consulta-detalhamento-analise-da-dre.scss'
import {getAnalisesDePcDevolvidas} from "../../../../services/dres/PrestacaoDeContas.service";
import TextoSuperior from "./TextoSuperior";
import CardsDevolucoesParaAcertoDaDre from "../../../Globais/CardsDevolucoesParaAcertoDaDre";
import ExibeAcertosEmLancamentosEDocumentosPorConta from "../../../Globais/ExibeAcertosEmLancamentosEDocumentosPorConta";

const ConsultaDetalhamentoAnaliseDaDre = () => {

    let {prestacao_conta_uuid} = useParams();
    const parametros = useLocation();
    const history = useHistory();

    // Hooks Personalizados
    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacao_conta_uuid)
    const [analisesDePcDevolvidas, setAnalisesDePcDevolvidas] = useState([])
    const [analiseAtualUuid, setAnaliseAtualUuid] = useState('')

    const totalAnalisesDePcDevolvidas = useMemo(() => analisesDePcDevolvidas.length, [analisesDePcDevolvidas]);

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

    const onClickVoltar = useCallback(() => {
        history.push('/analise-dre')
    }, [history])

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
            return (<span className={`texto-legenda-cor-DEVOLVIDA`}><strong>devolvida para acerto</strong></span>)

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
        return (
            <p className='fonte-16 mt-3'>
                Nesse período a
                Associação <strong> {prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.unidade && prestacaoDeContas.associacao.unidade.tipo_unidade ? prestacaoDeContas.associacao.unidade.tipo_unidade : ""} {prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.unidade && prestacaoDeContas.associacao.unidade.nome ? prestacaoDeContas.associacao.unidade.nome : ""}</strong>
                &nbsp; teve sua prestação de contas {exibeLabelStatus(prestacaoDeContas.status)}
                &nbsp; pela {prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.unidade && prestacaoDeContas.associacao.unidade.dre && prestacaoDeContas.associacao.unidade.dre.nome ? prestacaoDeContas.associacao.unidade.dre.nome : ""}
                &nbsp; e contou com <span
                className='texto-legenda-cor-EM_ANDAMENTO'><strong>{totalAnalisesDePcDevolvidas}</strong></span> {totalAnalisesDePcDevolvidas > 0 ? " devoluções para acertos. " : " devolução para acertos."}
            </p>
        )
    }

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Análise DRE</h1>
            <div className="page-content-inner">
                <TopoComBotaoVoltar
                    onClickVoltar={onClickVoltar}
                    periodoFormatado={parametros && parametros.state && parametros.state.periodoFormatado ? parametros.state.periodoFormatado : null}
                />
                <TextoSuperior
                    retornaTextoSuperior={retornaTextoSuperior}
                />
                 <h1 className="titulo-itens-painel mt-5">Devoluções para acertos da DRE</h1>
                <hr className="mt-0 mb-0"/>
                {totalAnalisesDePcDevolvidas > 0 ? (
                        <>
                            <CardsDevolucoesParaAcertoDaDre
                                prestacao_conta_uuid={prestacao_conta_uuid}
                                setAnaliseAtualUuid={setAnaliseAtualUuid}
                            />
                            <ExibeAcertosEmLancamentosEDocumentosPorConta
                                prestacaoDeContasUuid={prestacao_conta_uuid}
                                analiseAtualUuid={analiseAtualUuid}
                                exibeBtnIrParaPaginaDeAcertos={false}
                                exibeBtnIrParaPaginaDeReceitaOuDespesa={true}
                            />
                        </>
                    ) :
                    <p><strong>Não existem devoluções para serem exibidas</strong></p>
                }
            </div>
        </PaginasContainer>
    )
}
export default memo(ConsultaDetalhamentoAnaliseDaDre)

