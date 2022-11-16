import React, {Fragment, memo, useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    getContasDaAssociacao,
    getDocumentosAjustes,
    getAnaliseDocumentosPrestacaoConta,
    postJustificarNaoRealizacaoDocumentoPrestacaoConta,
    postMarcarComoRealizadoDocumentoPrestacaoConta,
    postMarcarComoLancamentoEsclarecido,
    postMarcarComoDocumentoEsclarecido,
    postLimparStatusDocumentoPrestacaoConta,
    patchAnaliseDocumentoPrestacaoConta,
    getExtratosBancariosAjustes,
    getTemAjustesExtratos
} from "../../../services/dres/PrestacaoDeContas.service";
import Loading from "../../../utils/Loading";
import {
    patchAnaliseLancamentoPrestacaoConta
} from "../../../services/dres/PrestacaoDeContas.service";
import {barraMensagemCustom} from "../BarraMensagem";


// Redux
import {useDispatch} from "react-redux";
import {
    addDetalharAcertos,
    limparDetalharAcertos
} from "../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions"

import TabelaAcertosDocumentos from "./TabelaAcertosDocumentos";


// Hooks Personalizados
import {
    useCarregaPrestacaoDeContasPorUuid
} from "../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import TabsAjustesEmExtratosBancarios from "./TabsAjustesEmExtratosBancarios";
import TabelaAcertosEmExtratosBancarios from "./TabelaAcertosEmExtratosBancarios";
import {visoesService} from "../../../services/visoes.service";
import BotoesDetalhesParaAcertosDeCategoriasDocumentos from "./BotoesDetalhesParaAcertosDeCategoriasDocumentos";
import {RelatorioAposAcertos} from './RelatorioAposAcertos'
import AcertosLancamentos from "./AcertosLancamentos";

const ExibeAcertosEmLancamentosEDocumentosPorConta = ({
                                                          exibeBtnIrParaPaginaDeAcertos = true,
                                                          exibeBtnIrParaPaginaDeReceitaOuDespesa = false,
                                                          prestacaoDeContasUuid,
                                                          analiseAtualUuid,
                                                          editavel
                                                      }) => {

    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacaoDeContasUuid)

    const history = useHistory();

    const rowsPerPageAcertosDocumentos = 5;

    // Redux
    const dispatch = useDispatch()

    const [exibeAcertosNosExtratos, setExibeAcertosNosExtratos] = useState(true);
    const [extratosBancariosAjustes, setExtratosBancariosAjustes] = useState(null);
    const [documentosAjustes, setDocumentosAjustes] = useState([])
    const [contasAssociacao, setContasAssociacao] = useState([])
    const [loadingExtratosBancarios, setLoadingExtratosBancarios] = useState(true)
    const [loadingDocumentos, setLoadingDocumentos] = useState(true)
    const [opcoesJustificativa, setOpcoesJustificativa] = useState([])
    const [expandedRowsDocumentos, setExpandedRowsDocumentos] = useState(null);
    const [contaUuidAjustesExtratosBancarios, setContaUuidAjustesExtratosBancarios] = useState('')
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [clickBtnEscolheContaExtratosBancarios, setClickBtnEscolheContaExtratosBancarios] = useState({0: true});
    const [textareaJustificativa, setTextareaJustificativa] = useState(() => {
    });
    const [showSalvar, setShowSalvar] = useState({});
    const [showSalvarEsclarecimento, setShowSalvarEsclarecimento] = useState({});
    const [txtEsclarecimentoLancamento, setTxtEsclarecimentoLancamento] = useState({});
    const [txtEsclarecimentoDocumento, setTxtEsclarecimentoDocumento] = useState({});

    const toggleBtnEscolheContaExtratosBancarios = (id) => {
        if (id !== Object.keys(clickBtnEscolheContaExtratosBancarios)[0]) {
            setClickBtnEscolheContaExtratosBancarios({
                [id]: !clickBtnEscolheContaExtratosBancarios[id]
            });
        }
    };

    const carregaDadosDasContasDaAssociacao = useCallback(async () => {
        if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid) {
            let contas = await getContasDaAssociacao(prestacaoDeContas.associacao.uuid);
            setContasAssociacao(contas);
        }
    }, [prestacaoDeContas]);

    useEffect(() => {
        carregaDadosDasContasDaAssociacao()
    }, [carregaDadosDasContasDaAssociacao, analiseAtualUuid])

    const consultaSeTemAjustesExtratos = useCallback(async () => {
        /*
            Essa função é necessária para verificar se a algum ajuste de extrato nessa analise, independente da conta,
            o retorno da API irá determinar se o bloco "Acertos nas informações de extratos bancários"
            deve ser exibido
        */

        setExibeAcertosNosExtratos(false);
        let tem_ajustes_extratos = await getTemAjustesExtratos(analiseAtualUuid);

        if (tem_ajustes_extratos && tem_ajustes_extratos.length > 0) {
            setExibeAcertosNosExtratos(true);
        } else {
            setExibeAcertosNosExtratos(false);
        }

    }, [analiseAtualUuid])

    const carregarAjustesExtratosBancarios = useCallback(async (conta_uuid) => {
        setContaUuidAjustesExtratosBancarios(conta_uuid);
        setLoadingExtratosBancarios(true);
        let extratos_bancarios_ajustes = await getExtratosBancariosAjustes(analiseAtualUuid, conta_uuid);
        setExtratosBancariosAjustes(extratos_bancarios_ajustes)
        setLoadingExtratosBancarios(false);
    }, [analiseAtualUuid])


    const carregaAcertosDocumentos = useCallback(async () => {
        setLoadingDocumentos(true)
        let {status_realizacao} = await getAnaliseDocumentosPrestacaoConta()
        let documentoAjuste = await getDocumentosAjustes(analiseAtualUuid)
        setDocumentosAjustes(documentoAjuste)
        setOpcoesJustificativa(status_realizacao)
        setLoadingDocumentos(false)
    }, [analiseAtualUuid])

    const limparDocumentoStatus = async (documentosSelecionados) => {
        setLoadingDocumentos(true)
        await postLimparStatusDocumentoPrestacaoConta({"uuids_analises_documentos": documentosSelecionados.map(doc => doc.uuid)})
        const documentoAjustes = await getDocumentosAjustes(documentosSelecionados[0].analise_prestacao_conta)
        setDocumentosAjustes(documentoAjustes)
        setLoadingDocumentos(false)
    }

    const marcarDocumentoComoRealizado = async (documentosSelecionados) => {
        setLoadingDocumentos(true)
        await postMarcarComoRealizadoDocumentoPrestacaoConta({"uuids_analises_documentos": documentosSelecionados.map(doc => doc.uuid)})
        const documentoAjustes = await getDocumentosAjustes(documentosSelecionados[0].analise_prestacao_conta)
        setDocumentosAjustes(documentoAjustes)
        setLoadingDocumentos(false)
    }

    const justificarNaoRealizacaoDocumentos = async (documentosSelecionados, textoConfirmadoJustificado) => {
        setLoadingDocumentos(true)
        await postJustificarNaoRealizacaoDocumentoPrestacaoConta({
            "uuids_analises_documentos": documentosSelecionados.map(doc => doc.uuid),
            "justificativa": textoConfirmadoJustificado
        })
        const documentoAjuste = await getDocumentosAjustes(documentosSelecionados[0].analise_prestacao_conta)
        setDocumentosAjustes(documentoAjuste)
        setLoadingDocumentos(false)
    }

    useEffect(() => {
        if (contasAssociacao && contasAssociacao.length > 0) {
            // TODO Rever os métodos consultaSeTemAjustesExtratos. Repete a consulta da API feira por carregarAjustesExtratosBancarios
            consultaSeTemAjustesExtratos();

           // Historia 77618 - Sprint 53
           let periodo_conta_ajustes_extratos_bancarios = JSON.parse(localStorage.getItem('periodoContaAcertosEmExtratosBancarios'));
           if (periodo_conta_ajustes_extratos_bancarios && periodo_conta_ajustes_extratos_bancarios.conta){
                carregarAjustesExtratosBancarios(periodo_conta_ajustes_extratos_bancarios.conta);
                toggleBtnEscolheContaExtratosBancarios(periodo_conta_ajustes_extratos_bancarios.conta)
            }else {
                carregarAjustesExtratosBancarios(contasAssociacao[0].uuid);
                toggleBtnEscolheContaExtratosBancarios(contasAssociacao[0].uuid)
            }
            carregaAcertosDocumentos(contasAssociacao[0].uuid)
            setClickBtnEscolheConta({0: true})
        }

    }, [contasAssociacao, carregaAcertosDocumentos, carregarAjustesExtratosBancarios, consultaSeTemAjustesExtratos])

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

    const handleChangeTextareaEsclarecimentoDocumento = (event, id) => {
        setShowSalvarEsclarecimento({
            ...showSalvarEsclarecimento,
            [id]: false
        })
        setTxtEsclarecimentoDocumento({
            ...txtEsclarecimentoDocumento,
            [id]: event.target.value
        })
    }

    const handleOnClick = (data, model) => {
        salvarJustificativa(data, model);
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

    const marcarComoEsclarecido = async (data, tipoModelo) => {
        let payload = {
            'esclarecimento': tipoModelo === 'lancamento' ? txtEsclarecimentoLancamento[data.uuid] : txtEsclarecimentoDocumento[data.uuid],
        }
        try {
            tipoModelo === 'lancamento' ? postMarcarComoLancamentoEsclarecido(payload, data.uuid) : postMarcarComoDocumentoEsclarecido(payload, data.uuid)
            setShowSalvarEsclarecimento({
                ...showSalvarEsclarecimento,
                [data.uuid]: true
            });
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }


    const rowExpansionTemplateDocumentos = (data) => {
        if (data && data.solicitacoes_de_ajuste_da_analise && data.solicitacoes_de_ajuste_da_analise.length > 0) {
            const salvarDesabilitados = !textareaJustificativa?.[data.uuid] || textareaJustificativa?.[data.uuid] === data.justificativa || showSalvar?.[data.uuid]
            const salvarDesabilitadosEsclarecimento = !txtEsclarecimentoDocumento?.[data.uuid] || txtEsclarecimentoDocumento?.[data.uuid] === data.esclarecimentos || showSalvarEsclarecimento?.[data.uuid]

            return (
                <>
                    {data.justificativa?.length > 0 && (
                        <div className="row">
                            <div className="col-12 px-4 py-2">
                                <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                    <p className='mb-1'><strong>Justificativa</strong></p>
                                </div>
                            </div>
                            <div className="form-group w-100 px-4 py-2" id="pointer-event-all">
                                <textarea
                                    defaultValue={data.justificativa}
                                    onChange={(event) => handleChangeTextareaJustificativa(event, data.uuid)}
                                    className="form-control"
                                    rows="3"
                                    id="justificativa"
                                    name="justificativa"
                                    placeholder="Escreva o comentário"
                                    disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA'}
                                >
                                </textarea>
                                <div className="bd-highlight d-flex justify-content-end align-items-center">

                                    {showSalvar?.[data.uuid] &&
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
                                        className={`btn btn-${salvarDesabilitados ? 'secondary' : 'success'} mt-2`}
                                        onClick={() => handleOnClick(data.uuid, 'documento')}
                                    >
                                        <strong>Salvar Justificativas</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {data.requer_ajuste_externo &&
                        <div className='col-12 mb-3'>
                            {barraMensagemCustom.BarraMensagemAcertoExterno("Acerto externo ao sistema.")}
                        </div>
                    }
                    {data.solicitacoes_de_ajuste_da_analise.map((ajuste, index) => (
                        <Fragment key={ajuste.id}>
                            <div className='col-12'>
                                <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                    <p className='mb-1'><strong>Item {index + 1}</strong></p>
                                </div>
                                <p className='mb-1'><strong>Tipo de acerto</strong></p>
                                <p>{ajuste.tipo_acerto.nome}</p>
                                {ajuste.detalhamento &&
                                    <span>
                                        <p className='mb-1'><strong>Detalhamento</strong></p>
                                        <p className='mb-0'>{ajuste.detalhamento}</p>
                                    </span>
                                }
                            </div>
                        </Fragment>
                    ))}
                    <div className='titulo-row-expanded-conferencia-de-esclarecimento m-2'></div>
                    {possuiSolicitacaoEsclarecimento(data.solicitacoes_de_ajuste_da_analise) &&
                        <div className="form-group w-100 col-12 px-3" id="pointer-event-all">
                            <div className='titulo-row-expanded-conferencia-de-lancamentos mb-4 '>
                                <p className='mb-1'><strong>Esclarecimento do documento</strong></p>
                            </div>
                            <textarea
                                rows="4"
                                cols="50"
                                name='esclarecimento'
                                defaultValue={data.esclarecimentos}
                                onChange={(event) => handleChangeTextareaEsclarecimentoDocumento(event, data.uuid)}
                                className="form-control"
                                placeholder="Digite aqui o esclarecimento"
                                disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA'}
                            />
                        </div>
                    }
                    <div className="bd-highlight d-flex justify-content-end align-items-center" id="pointer-event-all">
                        {showSalvarEsclarecimento?.[data.uuid] &&
                            <div className="">
                                <p className="mr-2 mt-3">
                                    <span className="mr-1">
                                        <FontAwesomeIcon
                                            style={{fontSize: '16px', color: '#297805'}}
                                            icon={faCheck}
                                        />
                                    </span>
                                    Salvo
                                </p>
                            </div>
                        }
                        {possuiSolicitacaoEsclarecimento(data.solicitacoes_de_ajuste_da_analise) &&
                            <button
                                disabled={salvarDesabilitadosEsclarecimento}
                                type="button"
                                className={`btn btn-${salvarDesabilitadosEsclarecimento ? 'secondary' : 'success'} mr-3`}
                                onClick={() => marcarComoEsclarecido(data, 'documento')}
                            >
                                <strong>Salvar esclarecimento</strong>
                            </button>
                        }
                    </div>
                    {data &&
                        <BotoesDetalhesParaAcertosDeCategoriasDocumentos
                            analise_documento={data}
                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                            prestacaoDeContas={prestacaoDeContas}
                        />
                    }
                </>
            )
        }
    };

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

    const possuiSolicitacaoEsclarecimento = (value) => {
        if(value){
            let solicitacoes = value.filter(element=> element.tipo_acerto.categoria === 'SOLICITACAO_ESCLARECIMENTO');
            return solicitacoes.length > 0 ? true : false;
        }
        return false;
    }

    return (
        <>
            {/*INICIO*/}

            {exibeAcertosNosExtratos &&
                <>
                    <h5 className="mb-4 mt-4"><strong>Acertos nas informações de extratos bancários</strong></h5>
                    <TabsAjustesEmExtratosBancarios
                        contasAssociacao={contasAssociacao}
                        carregarAjustesExtratosBancarios={carregarAjustesExtratosBancarios}
                        toggleBtnEscolheContaExtratoBancario={toggleBtnEscolheContaExtratosBancarios}
                        clickBtnEscolheContaExtratoBancario={clickBtnEscolheContaExtratosBancarios}
                    >
                        {loadingExtratosBancarios ? (
                                <Loading
                                    corGrafico="black"
                                    corFonte="dark"
                                    marginTop="0"
                                    marginBottom="0"
                                />
                            ) :
                            <>
                                <TabelaAcertosEmExtratosBancarios
                                    contasAssociacao={contasAssociacao}
                                    extratosBancariosAjustes={extratosBancariosAjustes}
                                    contaUuidAjustesExtratosBancarios={contaUuidAjustesExtratosBancarios}
                                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                                />
                            </>
                        }

                    </TabsAjustesEmExtratosBancarios>
                    <hr className="mt-4 mb-3"/>
                </>
            }

            {/*FIM*/}

            <h5 className="mb-4 mt-4"><strong>Acertos nos lançamentos</strong></h5>
            <>

                <AcertosLancamentos
                    analiseAtualUuid={analiseAtualUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    exibeBtnIrParaPaginaDeAcertos={exibeBtnIrParaPaginaDeAcertos}
                    exibeBtnIrParaPaginaDeReceitaOuDespesa={exibeBtnIrParaPaginaDeReceitaOuDespesa}
                    editavel={editavel}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                />



                <hr className="mt-4 mb-3"/>
                <h5 className="mb-4 mt-4"><strong>Acertos nos documentos</strong></h5>
                {loadingDocumentos ? (
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    ) :
                    <TabelaAcertosDocumentos
                        documentosAjustes={documentosAjustes}
                        prestacaoDeContas={prestacaoDeContas}
                        marcarDocumentoComoRealizado={marcarDocumentoComoRealizado}
                        limparDocumentoStatus={limparDocumentoStatus}
                        rowsPerPageAcertosDocumentos={rowsPerPageAcertosDocumentos}
                        justificarNaoRealizacaoDocumentos={justificarNaoRealizacaoDocumentos}
                        expandedRowsDocumentos={expandedRowsDocumentos}
                        setExpandedRowsDocumentos={setExpandedRowsDocumentos}
                        opcoesJustificativa={opcoesJustificativa}
                        rowExpansionTemplateDocumentos={rowExpansionTemplateDocumentos}
                    />
                }
                {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' ?
                <RelatorioAposAcertos
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    analiseAtualUuid={analiseAtualUuid}
                    podeGerarPrevia={true}
                /> : null}

            </>
        </>
    )
}
export default memo(ExibeAcertosEmLancamentosEDocumentosPorConta)