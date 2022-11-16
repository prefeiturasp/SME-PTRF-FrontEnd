import React, {Fragment, memo, useCallback, useEffect, useState} from "react";
import {
    getAnaliseLancamentosPrestacaoConta,
    getContasDaAssociacao,
    getLancamentosAjustes,
    patchAnaliseDocumentoPrestacaoConta,
    patchAnaliseLancamentoPrestacaoConta,
    postJustificarNaoRealizacaoLancamentoPrestacaoConta,
    postLimparStatusLancamentoPrestacaoConta,
    postMarcarComoLancamentoEsclarecido,
    postMarcarComoRealizadoLancamentoPrestacaoConta
} from "../../../../services/dres/PrestacaoDeContas.service";
import {TabelaAcertosLancamentos} from "./TabelaAcertosLancamentos";
import {barraMensagemCustom} from "../../BarraMensagem";
import {visoesService} from "../../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import BotoesDetalhesParaAcertosDeCategorias from "../BotoesDetalhesParaAcertosDeCategorias";
import useValorTemplate from "../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import useNumeroDocumentoTemplate
    from "../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate";
import {
    addDetalharAcertos,
    limparDetalharAcertos
} from "../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import Loading from "../../../../utils/Loading";
import './acertos-lancamentos.scss'

const AcertosLancamentos = ({
                                analiseAtualUuid,
                                prestacaoDeContas,
                                exibeBtnIrParaPaginaDeAcertos,
                                exibeBtnIrParaPaginaDeReceitaOuDespesa,
                                editavel,
                                prestacaoDeContasUuid
                            }) => {

    const rowsPerPageAcertosLancamentos = 5;

    // Hooks Personalizados
    const valor_template = useValorTemplate()
    const dataTemplate = useDataTemplate()
    const numeroDocumentoTemplate = useNumeroDocumentoTemplate()

    const dispatch = useDispatch()

    const history = useHistory();

    const [contasAssociacao, setContasAssociacao] = useState([])
    const [loadingLancamentos, setLoadingLancamentos] = useState(true)
    const [opcoesJustificativa, setOpcoesJustificativa] = useState([])
    const [lancamentosAjustes, setLancamentosAjustes] = useState([])
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [expandedRowsLancamentos, setExpandedRowsLancamentos] = useState(null);
    const [textareaJustificativa, setTextareaJustificativa] = useState(() => {});
    const [showSalvar, setShowSalvar] = useState({});
    const [txtEsclarecimentoLancamento, setTxtEsclarecimentoLancamento] = useState({});
    const [showSalvarEsclarecimento, setShowSalvarEsclarecimento] = useState({});


    const carregaDadosDasContasDaAssociacao = useCallback(async () => {
        if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid) {
            let contas = await getContasDaAssociacao(prestacaoDeContas.associacao.uuid);
            setContasAssociacao(contas);
        }
    }, [prestacaoDeContas]);

    useEffect(() => {
        carregaDadosDasContasDaAssociacao()
    }, [carregaDadosDasContasDaAssociacao, analiseAtualUuid])

    const carregaAcertosLancamentos = useCallback(async (conta_uuid, filtrar_por_lancamento = null, filtrar_por_tipo_de_ajuste = null) => {
        setLoadingLancamentos(true)
        let {status_realizacao} = await getAnaliseLancamentosPrestacaoConta()
        let lancamentos_ajustes = await getLancamentosAjustes(analiseAtualUuid, conta_uuid, filtrar_por_lancamento, filtrar_por_tipo_de_ajuste)

        console.log("XXXXXXXXXXXXXXXx carregaAcertosLancamentos ", lancamentos_ajustes)

        setOpcoesJustificativa(status_realizacao)
        setLancamentosAjustes(lancamentos_ajustes)
        setLoadingLancamentos(false)
    }, [analiseAtualUuid])

    useEffect(() => {
        if (contasAssociacao && contasAssociacao.length > 0) {
            carregaAcertosLancamentos(contasAssociacao[0].uuid)
        }
    }, [contasAssociacao, carregaAcertosLancamentos])

    const toggleBtnEscolheConta = (id) => {
        if (id !== Object.keys(clickBtnEscolheConta)[0]) {
            setClickBtnEscolheConta({
                [id]: !clickBtnEscolheConta[id]
            });
        }
    };

    const limparStatus = async (lancamentosSelecionados) => {
        setLoadingLancamentos(true)
        await postLimparStatusLancamentoPrestacaoConta({"uuids_analises_lancamentos": lancamentosSelecionados.map(lanc => lanc.analise_lancamento.uuid)})
        const lancamentoAjuste = await getLancamentosAjustes(lancamentosSelecionados[0].analise_lancamento.analise_prestacao_conta, lancamentosAjustes[0].conta)
        setLancamentosAjustes(lancamentoAjuste)
        setLoadingLancamentos(false)
    }

    const marcarComoRealizado = async (lancamentosSelecionados) => {
        setLoadingLancamentos(true)
        await postMarcarComoRealizadoLancamentoPrestacaoConta({"uuids_analises_lancamentos": lancamentosSelecionados.map(lanc => lanc.analise_lancamento.uuid)})
        const lancamentoAjuste = await getLancamentosAjustes(lancamentosSelecionados[0].analise_lancamento.analise_prestacao_conta, lancamentosAjustes[0].conta)
        setLancamentosAjustes(lancamentoAjuste)
        setLoadingLancamentos(false)
    }

    const justificarNaoRealizacao = async (lancamentosSelecionados, textoConfirmadoJustificado) => {
        setLoadingLancamentos(true)
        await postJustificarNaoRealizacaoLancamentoPrestacaoConta({
            "uuids_analises_lancamentos": lancamentosSelecionados.map(lanc => lanc.analise_lancamento.uuid),
            "justificativa": textoConfirmadoJustificado
        })
        const lancamentoAjuste = await getLancamentosAjustes(lancamentosSelecionados[0].analise_lancamento.analise_prestacao_conta, lancamentosAjustes[0].conta)
        setLancamentosAjustes(lancamentoAjuste)
        setLoadingLancamentos(false)
    }

    const rowExpansionTemplateLancamentos = (data) => {
        if (data && data.analise_lancamento && data.analise_lancamento.solicitacoes_de_ajuste_da_analise && data.analise_lancamento.solicitacoes_de_ajuste_da_analise.length > 0) {
            const               salvarDesabilitados = !textareaJustificativa?.[data.analise_lancamento.uuid] || textareaJustificativa?.[data.analise_lancamento.uuid] === data.analise_lancamento.justificativa || showSalvar?.[data.analise_lancamento.uuid]
            const salvarDesabilitadosEsclarecimento = !txtEsclarecimentoLancamento?.[data.analise_lancamento.uuid] || txtEsclarecimentoLancamento?.[data.analise_lancamento.uuid] === data.analise_lancamento.esclarecimentos || showSalvarEsclarecimento?.[data.analise_lancamento.uuid]
            return (
                <>
                    <h1>Estou aqui rowExpansionTemplateLancamentos</h1>
                    {data.documento_mestre.mensagem_inativa &&
                        <div className='row'>
                            <div className='col-12 p-1 px-4 py-1'>
                                {barraMensagemCustom.BarraMensagemInativa(data.documento_mestre.mensagem_inativa)}
                            </div>
                        </div>
                    }
                    {data.analise_lancamento.justificativa?.length > 0 && (
                        <Fragment>
                            <div className="row">
                                <div className="col-12 px-4 py-2">
                                    <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                        <p className='mb-1'><strong>Justificativa</strong></p>
                                    </div>
                                </div>
                                <div className="form-group w-100 px-4 py-2" id="pointer-event-all">
                                    <textarea
                                        defaultValue={data.analise_lancamento.justificativa}
                                        onChange={(event) => handleChangeTextareaJustificativa(event, data.analise_lancamento.uuid)}
                                        className="form-control"
                                        rows="3"
                                        id="justificativa"
                                        name="justificativa"
                                        placeholder="Escreva o comentário"
                                        disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA'}
                                    >
                                    </textarea>
                                    <div className="bd-highlight d-flex justify-content-end align-items-center">

                                        {showSalvar?.[data.analise_lancamento.uuid] &&
                                            <div className="">
                                                <p className="mr-2 mt-3">
                                                    <span className="mr-1">
                                                        <FontAwesomeIcon
                                                            style={{fontSize: '16px', color: '#297805'}}
                                                            icon={faCheck}
                                                        />
                                                    </span>Salvo
                                                </p>
                                            </div>
                                        }
                                        <button
                                            disabled={salvarDesabilitados}
                                            type="button"
                                            className={`btn btn-${salvarDesabilitados ? 'secondary' : 'success'} mt-2 mb-0`}
                                            onClick={() => handleOnClick(data.analise_lancamento.uuid, 'lancamento')}
                                        >
                                            <strong>Salvar Justificativas</strong>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )}
                    {data.analise_lancamento.requer_ajustes_externos &&
                        <div className='row'>
                            <div className='col-12 mb-1 px-4 py-1'>
                                {barraMensagemCustom.BarraMensagemAcertoExterno("Acerto externo ao sistema.")}
                            </div>
                        </div>
                    }
                    {data.analise_lancamento.solicitacoes_de_ajuste_da_analise.map((ajuste, index) => (
                        <Fragment key={ajuste.id}>
                            <div className='row'>
                                <div className='col-12 px-4 py-2'>
                                    <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                        <p className='mb-1'><strong>Item {index + 1}</strong></p>
                                    </div>
                                    <p className='mb-1'><strong>Tipo de acerto</strong></p>
                                    <p>{ajuste.tipo_acerto.nome}</p>
                                    {ajuste.detalhamento &&
                                        <span>
                                            <p className='mb-1'><strong>Detalhamento</strong></p>
                                            <p className='mb-4'>{ajuste.detalhamento}</p>
                                        </span>
                                    }
                                </div>
                            </div>
                        </Fragment>
                    ))}
                    {possuiSolicitacaoEsclarecimento(data.analise_lancamento.solicitacoes_de_ajuste_da_analise) &&
                        <div className="row">
                            <div className="col-12 px-4 py-2" id="pointer-event-all">
                                <div className='titulo-row-expanded-conferencia-de-lancamentos mb-4'>
                                    <p className='mb-1'><strong>Esclarecimento de lançamento</strong></p>
                                </div>
                                <textarea
                                    rows="4"
                                    cols="50"
                                    name='esclarecimento'
                                    defaultValue={data.analise_lancamento.esclarecimentos}
                                    onChange={(event) => handleChangeTextareaEsclarecimentoLancamento(event, data.analise_lancamento.uuid)}
                                    className="form-control"
                                    placeholder="Digite aqui o esclarecimento"
                                    disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA'}
                                />
                            </div>
                        </div>
                    }
                    <div className="bd-highlight d-flex justify-content-end align-items-center" id="pointer-event-all">
                        {showSalvarEsclarecimento?.[data.analise_lancamento.uuid] &&
                            <div className="">
                                <p className="mr-2 mt-3">
                                    <span className="mr-1">
                                        <FontAwesomeIcon
                                            style={{fontSize: '16px', color: '#297805'}}
                                            icon={faCheck}
                                        />
                                    </span>Salvo
                                </p>
                            </div>
                        }
                        {possuiSolicitacaoEsclarecimento(data.analise_lancamento.solicitacoes_de_ajuste_da_analise) &&
                            <button
                                disabled={salvarDesabilitadosEsclarecimento}
                                type="button"
                                className={`btn btn-${salvarDesabilitadosEsclarecimento ? 'secondary' : 'success'} mb-0 mr-2`}
                                onClick={() => marcarComoEsclarecido(data.analise_lancamento)}
                            >
                                <strong>Salvar esclarecimento</strong>
                            </button>
                        }
                    </div>

                    {exibeBtnIrParaPaginaDeAcertos &&
                        redirecionaDetalheAcerto(data)
                    }
                    {exibeBtnIrParaPaginaDeReceitaOuDespesa &&
                        redirecionaDetalheReceitaOuDespesa(data)
                    }
                    {data && data.analise_lancamento &&
                        <BotoesDetalhesParaAcertosDeCategorias
                            analise_lancamento={data.analise_lancamento}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                            tipo_transacao={data.tipo_transacao}
                        />
                    }
                </>
            )
        }
    };

    const handleChangeTextareaJustificativa = (event, id) => {
        setShowSalvar({
            ...showSalvar,
            [id]: false
        })
        setTextareaJustificativa({
            ...textareaJustificativa,
            [id]: event.target.value
        })
    };

    const handleOnClick = (data, model) => {
        salvarJustificativa(data, model);
    }

    const possuiSolicitacaoEsclarecimento = (value) => {
        if (value) {
            let solicitacoes = value.filter(element => element.tipo_acerto.categoria === 'SOLICITACAO_ESCLARECIMENTO');
            return solicitacoes.length > 0;
        }
        return false;
    }

    const salvarJustificativa = async (data, model) => {
        let payload = {
            'justificativa': textareaJustificativa[data],
        }

        try {
            if (model === 'lancamento') {
                await patchAnaliseLancamentoPrestacaoConta(payload, data)
            } else if (model === 'documento') {
                await patchAnaliseDocumentoPrestacaoConta(payload, data)
            }
            setShowSalvar({
                ...showSalvar,
                [data]: true
            });
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const marcarComoEsclarecido = async (data) => {
        let payload = {
            'esclarecimento': txtEsclarecimentoLancamento[data.uuid],
        }
        try {
            await postMarcarComoLancamentoEsclarecido(payload, data.uuid)
            setShowSalvarEsclarecimento({
                ...showSalvarEsclarecimento,
                [data.uuid]: true
            });
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const handleChangeTextareaEsclarecimentoLancamento = (event, id) => {
        setShowSalvarEsclarecimento({
            ...showSalvarEsclarecimento,
            [id]: false
        })
        setTxtEsclarecimentoLancamento({
            ...txtEsclarecimentoLancamento,
            [id]: event.target.value
        })
    }

    const addDispatchRedireciona = (lancamentos) => {
        dispatch(limparDetalharAcertos())
        dispatch(addDetalharAcertos(lancamentos))
        history.push(`/dre-detalhe-prestacao-de-contas-detalhar-acertos/${prestacaoDeContas.uuid}`)
    }

    const redirecionaDetalheAcerto = (lancamento) => {
        if (editavel) {
            return (
                <div className='text-right border-top pt-3 pb-2 container-botoes-ajustes'>
                    <button onClick={() => addDispatchRedireciona(lancamento)} className='btn btn-outline-success'>
                        <strong>Editar acertos solicitados</strong>
                    </button>
                </div>
            )
        }

    }

    const redirecionaDetalheReceitaOuDespesa = (data) => {

        if (editavel) {
            let tipo_de_transacao;
            if (data.tipo_transacao === 'Gasto') {
                tipo_de_transacao = 'despesa'
            } else if (data.tipo_transacao === 'Crédito') {
                tipo_de_transacao = 'receita'
            }
            return (
                <div className='text-right border-top pt-3 pb-2 container-botoes-ajustes'>
                    <button onClick={() => redirecionaPaginaDespesaOuReceita(data)} className='btn btn-outline-success'>
                        <strong>Ir para {tipo_de_transacao}</strong>
                    </button>
                </div>
            )
        }
    }

    const redirecionaPaginaDespesaOuReceita = (data) => {
        let url;
        if (data && data.tipo_transacao === 'Gasto' && data.documento_mestre) {
            if (data.documento_mestre.receitas_saida_do_recurso) {
                url = `/cadastro-de-despesa-recurso-proprio/${data.documento_mestre.receitas_saida_do_recurso}/${data.documento_mestre.uuid}`
            } else {
                url = '/edicao-de-despesa/' + data.documento_mestre.uuid;
            }
        } else if (data.tipo_transacao === 'Crédito' && data.documento_mestre) {
            url = `/edicao-de-receita/${data.documento_mestre.uuid}`
        }
        history.push(url)
    };

    return (
        <>
            <nav>
                <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">
                    {contasAssociacao && contasAssociacao && contasAssociacao.length > 0 && contasAssociacao.map((conta, indexTabs) =>
                        <Fragment key={`key_${conta.uuid}`}>
                            <a
                                onClick={() => {
                                    carregaAcertosLancamentos(conta.uuid)
                                    toggleBtnEscolheConta(`${indexTabs}`);
                                }}
                                className={`nav-link btn-escolhe-acao ${clickBtnEscolheConta[`${indexTabs}`] ? "active" : ""}`}
                                id={`nav-conferencia-de-lancamentos-${conta.uuid}-tab`}
                                data-toggle="tab"
                                href={`#nav-conferencia-de-lancamentos-${conta.uuid}`}
                                role="tab"
                                aria-controls={`nav-conferencia-de-lancamentos-${conta.uuid}`}
                                aria-selected="true"
                            >
                                Conta {conta.tipo_conta.nome}
                            </a>
                        </Fragment>
                    )}
                </div>
            </nav>
            {loadingLancamentos ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <div className="tab-content" id="nav-conferencia-de-lancamentos-tabContent">
                    <div className="tab-pane fade show active" role="tabpanel">
                        <TabelaAcertosLancamentos
                            lancamentosAjustes={lancamentosAjustes}
                            limparStatus={limparStatus}
                            prestacaoDeContas={prestacaoDeContas}
                            marcarComoRealizado={marcarComoRealizado}
                            justificarNaoRealizacao={justificarNaoRealizacao}
                            opcoesJustificativa={opcoesJustificativa}
                            expandedRowsLancamentos={expandedRowsLancamentos}
                            setExpandedRowsLancamentos={setExpandedRowsLancamentos}
                            rowExpansionTemplateLancamentos={rowExpansionTemplateLancamentos}
                            rowsPerPageAcertosLancamentos={rowsPerPageAcertosLancamentos}
                            valor_template={valor_template}
                            dataTemplate={dataTemplate}
                            numeroDocumentoTemplate={numeroDocumentoTemplate}
                        />
                    </div>
                </div>
            }

        </>
    )
}
export default memo(AcertosLancamentos)