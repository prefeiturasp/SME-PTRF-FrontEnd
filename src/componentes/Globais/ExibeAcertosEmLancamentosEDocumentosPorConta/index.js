import React, {Fragment, memo, useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import useValorTemplate from "../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate";
import useDataTemplate from "../../../hooks/Globais/useDataTemplate";
import useNumeroDocumentoTemplate
    from "../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate";
import {
    getContasDaAssociacao,
    getDocumentosAjustes,
    getAnaliseDocumentosPrestacaoConta,
    postJustificarNaoRealizacaoDocumentoPrestacaoConta,
    postMarcarComoRealizadoDocumentoPrestacaoConta,
    postLimparStatusDocumentoPrestacaoConta,
    getLancamentosAjustes,
    patchAnaliseDocumentoPrestacaoConta,
    getTiposDeAcertoLancamentos,
    getExtratosBancariosAjustes,
    getTemAjustesExtratos
} from "../../../services/dres/PrestacaoDeContas.service";
import {TabelaAcertosLancamentos} from "./TabelaAcertosLancamentos";
import TabsAcertosEmLancamentosPorConta from "./TabsAcertosEmLancamentosPorConta";
import Loading from "../../../utils/Loading";
import {
    postLimparStatusLancamentoPrestacaoConta,
    postJustificarNaoRealizacaoLancamentoPrestacaoConta,
    postMarcarComoRealizadoLancamentoPrestacaoConta,
    patchAnaliseLancamentoPrestacaoConta
} from "../../../services/dres/PrestacaoDeContas.service";
import {barraMensagemCustom} from "../../Globais/BarraMensagem";


// Redux
import {useDispatch} from "react-redux";
import {
    addDetalharAcertos,
    limparDetalharAcertos
} from "../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions"

import TabelaAcertosDocumentos from "./TabelaAcertosDocumentos";
import {getAnaliseLancamentosPrestacaoConta} from "../../../services/dres/PrestacaoDeContas.service";


// Hooks Personalizados
import {
    useCarregaPrestacaoDeContasPorUuid
} from "../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import TabsAjustesEmExtratosBancarios from "./TabsAjustesEmExtratosBancarios";
import TabelaAcertosEmExtratosBancarios from "./TabelaAcertosEmExtratosBancarios";
import {visoesService} from "../../../services/visoes.service";
import BotoesDetalhesParaAcertosDeCategorias from "./BotoesDetalhesParaAcertosDeCategorias";

const ExibeAcertosEmLancamentosEDocumentosPorConta = ({
                                                          exibeBtnIrParaPaginaDeAcertos = true,
                                                          exibeBtnIrParaPaginaDeReceitaOuDespesa = false,
                                                          prestacaoDeContasUuid,
                                                          analiseAtualUuid,
                                                          editavel
                                                      }) => {

    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacaoDeContasUuid)

    const history = useHistory();

    const rowsPerPageAcertosLancamentos = 5;
    const rowsPerPageAcertosDocumentos = 5;

    // Hooks Personalizados
    const valor_template = useValorTemplate()
    const dataTemplate = useDataTemplate()
    const numeroDocumentoTemplate = useNumeroDocumentoTemplate()

    // Redux
    const dispatch = useDispatch()

    // Filtros Lancamentos
    const initialStateFiltros = {
        filtrar_por_lancamento: '',
        filtrar_por_tipo_de_ajuste: '',
    }

    const [exibeAcertosNosExtratos, setExibeAcertosNosExtratos] = useState(true);
    const [extratosBancariosAjustes, setExtratosBancariosAjustes] = useState(null);
    const [lancamentosAjustes, setLancamentosAjustes] = useState([])
    const [documentosAjustes, setDocumentosAjustes] = useState([])
    const [contasAssociacao, setContasAssociacao] = useState([])
    const [loadingExtratosBancarios, setLoadingExtratosBancarios] = useState(true)
    const [loadingLancamentos, setLoadingLancamentos] = useState(true)
    const [loadingDocumentos, setLoadingDocumentos] = useState(true)
    const [opcoesJustificativa, setOpcoesJustificativa] = useState([])
    const [expandedRowsLancamentos, setExpandedRowsLancamentos] = useState(null);
    const [expandedRowsDocumentos, setExpandedRowsDocumentos] = useState(null);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [contaUuid, setContaUuid] = useState('')
    const [listaTiposDeAcertoLancamentos, setListaTiposDeAcertoLancamentos] = useState([])
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [clickBtnEscolheContaExtratosBancarios, setClickBtnEscolheContaExtratosBancarios] = useState({0: true});
    const [textareaJustificativa, setTextareaJustificativa] = useState(() => {
    });
    const [showSalvar, setShowSalvar] = useState({});
    const [showSalvarEsclarecimento, setShowSalvarEsclarecimento] = useState(false);
    const [txtEsclarecimentoLancamento, setTxtEsclarecimentoLancamento] = useState({});
    const [txtEsclarecimentoDocumento, setTxtEsclarecimentoDocumento] = useState({});


    const toggleBtnEscolheConta = (id) => {
        if (id !== Object.keys(clickBtnEscolheConta)[0]) {
            setClickBtnEscolheConta({
                [id]: !clickBtnEscolheConta[id]
            });
        }
    };

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
        setContaUuid(conta_uuid);
        setLoadingExtratosBancarios(true);
        let extratos_bancarios_ajustes = await getExtratosBancariosAjustes(analiseAtualUuid, conta_uuid);
        setExtratosBancariosAjustes(extratos_bancarios_ajustes)
        setLoadingExtratosBancarios(false);
    }, [analiseAtualUuid])

    const carregaAcertosLancamentos = useCallback(async (conta_uuid, filtrar_por_lancamento = null, filtrar_por_tipo_de_ajuste = null) => {
        setContaUuid(conta_uuid)
        setLoadingLancamentos(true)
        let {status_realizacao} = await getAnaliseLancamentosPrestacaoConta()
        let lancamentos_ajustes = await getLancamentosAjustes(analiseAtualUuid, conta_uuid, filtrar_por_lancamento, filtrar_por_tipo_de_ajuste)

        setOpcoesJustificativa(status_realizacao)
        setLancamentosAjustes(lancamentos_ajustes)
        setLoadingLancamentos(false)
    }, [analiseAtualUuid])

    const carregaAcertosDocumentos = useCallback(async () => {
        setLoadingDocumentos(true)
        let {status_realizacao} = await getAnaliseDocumentosPrestacaoConta()
        let documentoAjuste = await getDocumentosAjustes(analiseAtualUuid)
        setDocumentosAjustes(documentoAjuste)
        setOpcoesJustificativa(status_realizacao)
        setLoadingDocumentos(false)
    }, [analiseAtualUuid])


    const limparStatus = async (lancamentosSelecionados) => {
        setLoadingLancamentos(true)
        await postLimparStatusLancamentoPrestacaoConta({"uuids_analises_lancamentos": lancamentosSelecionados.map(lanc => lanc.analise_lancamento.uuid)})
        const lancamentoAjuste = await getLancamentosAjustes(lancamentosSelecionados[0].analise_lancamento.analise_prestacao_conta, lancamentosAjustes[0].conta)
        setLancamentosAjustes(lancamentoAjuste)
        setLoadingLancamentos(false)
    }

    const limparDocumentoStatus = async (documentosSelecionados) => {
        setLoadingDocumentos(true)
        await postLimparStatusDocumentoPrestacaoConta({"uuids_analises_documentos": documentosSelecionados.map(doc => doc.uuid)})
        const documentoAjustes = await getDocumentosAjustes(documentosSelecionados[0].analise_prestacao_conta)
        setDocumentosAjustes(documentoAjustes)
        setLoadingDocumentos(false)
    }

    const marcarComoRealizado = async (lancamentosSelecionados) => {
        setLoadingLancamentos(true)
        await postMarcarComoRealizadoLancamentoPrestacaoConta({"uuids_analises_lancamentos": lancamentosSelecionados.map(lanc => lanc.analise_lancamento.uuid)})
        const lancamentoAjuste = await getLancamentosAjustes(lancamentosSelecionados[0].analise_lancamento.analise_prestacao_conta, lancamentosAjustes[0].conta)
        setLancamentosAjustes(lancamentoAjuste)
        setLoadingLancamentos(false)
    }

    const marcarDocumentoComoRealizado = async (documentosSelecionados) => {
        setLoadingDocumentos(true)
        await postMarcarComoRealizadoDocumentoPrestacaoConta({"uuids_analises_documentos": documentosSelecionados.map(doc => doc.uuid)})
        const documentoAjustes = await getDocumentosAjustes(documentosSelecionados[0].analise_prestacao_conta)
        setDocumentosAjustes(documentoAjustes)
        setLoadingDocumentos(false)
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
            carregarAjustesExtratosBancarios(contasAssociacao[0].uuid);
            carregaAcertosLancamentos(contasAssociacao[0].uuid)
            carregaAcertosDocumentos(contasAssociacao[0].uuid)
            setClickBtnEscolheConta({0: true})
        }
    }, [consultaSeTemAjustesExtratos, contasAssociacao, carregaAcertosLancamentos, carregaAcertosDocumentos, carregarAjustesExtratosBancarios])

    useEffect(() => {

        let mounted = true;

        const carregaTiposDeAcertoLancamentos = async () => {
            if (mounted) {
                let tipos_de_acerto_lancamentos = await getTiposDeAcertoLancamentos()
                setListaTiposDeAcertoLancamentos(tipos_de_acerto_lancamentos)
            }
        }
        carregaTiposDeAcertoLancamentos()

        return () => {
            mounted = false;
        }

    }, [])

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
    
    const handleChangeTextareaEsclarecimentoLancamento = (event, id) => {
        setShowSalvarEsclarecimento({
            ...showSalvar,
            [id]: false
        })
        setTxtEsclarecimentoLancamento({
            ...txtEsclarecimentoLancamento,
            [id]: event.target.value
        })
        console.log('txtEsclarecimentoLancamento', txtEsclarecimentoLancamento)
    }

    const handleChangeTextareaEsclarecimentoDocumento = (event, id) => {
        setShowSalvarEsclarecimento({
            ...showSalvar,
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

    const salvarJustificativaEsclarecimento = async (data, tipoModelo) => {
        console.log('data', data);
        console.log('tipoModelo', tipoModelo);
        console.log('txtEsclarecimentoLancamento', txtEsclarecimentoLancamento)
        let payload = {
            'esclarecimento': tipoModelo === 'lancamento' ? txtEsclarecimentoLancamento : txtEsclarecimentoDocumento,
        }
        console.log('payload', payload);

        try {
            setShowSalvarEsclarecimento(true);
            // Liniker Precisa do back-end
            // tipoModelo === 'lancamento' ? apiLancamento : apiDocumento
            console.log('campo esclarecido : ', payload['esclarecimento'])
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const rowExpansionTemplateLancamentos = (data) => {
        if (data && data.analise_lancamento && data.analise_lancamento.solicitacoes_de_ajuste_da_analise && data.analise_lancamento.solicitacoes_de_ajuste_da_analise.length > 0) {
            const salvarDesabilitados = !textareaJustificativa?.[data.analise_lancamento.uuid] || textareaJustificativa?.[data.analise_lancamento.uuid] === data.analise_lancamento.justificativa || showSalvar?.[data.analise_lancamento.uuid]
            return (
                <>
                    {data.analise_lancamento.justificativa?.length > 0 && (
                        <Fragment>
                            <div className="row">
                                <div className="col-12 px-4 py-2">
                                    <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                        <p className='mb-1'><strong>Justificativa</strong></p>
                                    </div>
                                </div>
                                <div className="form-group w-100 px-4 py-2" style={{pointerEvents: 'all'}}>
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
                                            className={`btn btn-${salvarDesabilitados ? 'secondary' : 'success'} mt-2`}
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
                            <div className='col-12 mb-3 px-4 py-2'>
                                {barraMensagemCustom.BarraMensagemSucessAzul("Favor realizar os ajustes solicitados que são externos ao sistema.")}
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
                                    <div className='titulo-row-expanded-conferencia-de-esclarecimento mb-2'></div>
                                        {ajuste.tipo_acerto.categoria === 'SOLICITACAO_ESCLARECIMENTO' &&
                                        <div className="form-group w-100 " style={{pointerEvents: 'all', resize: false}}>
                                            <label className='mb-1'>Esclarecimento do lançamento</label>
                                            <textarea
                                                rows="4"
                                                cols="50"
                                                name='esclarecimento'
                                                defaultValue={data.esclarecimento}
                                                onChange={(event) => handleChangeTextareaEsclarecimentoLancamento(event, data.analise_lancamento.uuid)}
                                                className="form-control"
                                                placeholder="Digite aqui o esclarecimento"
                                                disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA'}
                                            />
                                        </div>
                                        }
                                        <div className="bd-highlight d-flex justify-content-end align-items-center" style={{pointerEvents: 'all'}}>
                                            {showSalvarEsclarecimento?.[data.analise_lancamento.uuid] && <div className="">
                                                <p className="mr-2 mt-3">
                                                    <span className="mr-1">
                                                    <FontAwesomeIcon
                                                        style={{fontSize: '16px', color:'#297805'}}
                                                        icon={faCheck}
                                                    />
                                                    </span>Salvo
                                                </p>
                                            </div>}
                                            {ajuste.tipo_acerto.categoria === 'SOLICITACAO_ESCLARECIMENTO' &&
                                            <button 
                                                disabled={!txtEsclarecimentoLancamento[data.analise_lancamento.uuid]}
                                                type="button" 
                                                className={`btn btn-success mt-2`}
                                                onClick={() => salvarJustificativaEsclarecimento(ajuste.uuid, 'lancamento')}
                                                >
                                                <strong>Salvar</strong>
                                            </button>
                                            }
                                        </div>
                                    {ajuste.detalhamento &&
                                        <span>
                                        <p className='mb-1'><strong>Detalhamento</strong></p>
                                        <p className='mb-0'>{ajuste.detalhamento}</p>
                                    </span>
                                    }
                                </div>
                            </div>
                        </Fragment>
                    ))}
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

    const rowExpansionTemplateDocumentos = (data) => {
        if (data && data.solicitacoes_de_ajuste_da_analise && data.solicitacoes_de_ajuste_da_analise.length > 0) {
            const salvarDesabilitados = !textareaJustificativa?.[data.uuid] || textareaJustificativa?.[data.uuid] === data.justificativa || showSalvar?.[data.uuid]
            return (
                <>
                    {data.justificativa?.length > 0 && (
                        <div className="row">
                            <div className="col-12 px-4 py-2">
                                <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                    <p className='mb-1'><strong>Justificativa</strong></p>
                                </div>
                            </div>
                            <div className="form-group w-100 px-4 py-2" style={{pointerEvents: 'all'}}>
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
                            {barraMensagemCustom.BarraMensagemSucessAzul("Favor realizar os ajustes solicitados que são externos ao sistema.")}
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
                            <div className='titulo-row-expanded-conferencia-de-esclarecimento mb-2'></div>
                                {ajuste.tipo_acerto.categoria === 'SOLICITACAO_ESCLARECIMENTO' &&
                                <div className="form-group w-100 " style={{pointerEvents: 'all', resize: false}}>
                                    <label className='mb-1'>Esclarecimento do documento</label>
                                    <textarea
                                        rows="4"
                                        cols="50"
                                        name='esclarecimento'
                                        defaultValue={data.esclarecimento}
                                        onChange={(event) => handleChangeTextareaEsclarecimentoDocumento(event, data.uuid)}
                                        className="form-control"
                                        placeholder="Digite aqui o esclarecimento"
                                        disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA'}
                                    />
                                </div>
                                }
                                <div className="bd-highlight d-flex justify-content-end align-items-center" style={{pointerEvents: 'all'}}>
                                    {showSalvarEsclarecimento && <div className="">
                                        <p className="mr-2 mt-3">
                                            <span className="mr-1">
                                            <FontAwesomeIcon
                                                style={{fontSize: '16px', color:'#297805'}}
                                                icon={faCheck}
                                            />
                                            </span>Salvo
                                        </p>
                                    </div>}
                                    {ajuste.tipo_acerto.categoria === 'SOLICITACAO_ESCLARECIMENTO' &&
                                    <button
                                        disabled={txtEsclarecimentoDocumento && !showSalvarEsclarecimento ? false : true}
                                        type="button" 
                                        className={`btn btn-success mt-2`}
                                        onClick={() => salvarJustificativaEsclarecimento(ajuste.uuid, 'documento')}
                                        >
                                        <strong>Salvar</strong>
                                    </button>
                                    }
                    </div>
                            {ajuste.detalhamento &&
                            <span>
                                <p className='mb-1'><strong>Detalhamento</strong></p>
                                <p className='mb-0'>{ajuste.detalhamento}</p>
                            </span>
                                }
                            </div>
                        </Fragment>
                    ))}
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
                        <strong>Ir para página de acertos</strong>
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
                                    extratosBancariosAjustes={extratosBancariosAjustes}
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
                <TabsAcertosEmLancamentosPorConta
                    contasAssociacao={contasAssociacao}
                    carregaAcertosLancamentos={carregaAcertosLancamentos}
                    setStateFiltros={setStateFiltros}
                    initialStateFiltros={initialStateFiltros}
                    analiseAtualUuid={analiseAtualUuid}
                    toggleBtnEscolheConta={toggleBtnEscolheConta}
                    clickBtnEscolheConta={clickBtnEscolheConta}
                >

                    {loadingLancamentos ? (
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        ) :
                        <>
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
                        </>
                    }
                </TabsAcertosEmLancamentosPorConta>

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
            </>
        </>
    )
}
export default memo(ExibeAcertosEmLancamentosEDocumentosPorConta)