import React, {Fragment, memo, useCallback, useEffect, useState} from "react";
import {
    getAnaliseLancamentosPrestacaoConta,
    getContasDaAssociacaoComAcertosEmLancamentos,
    getLancamentosAjustes,
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
    limparDetalharAcertos,
    origemPagina
} from "../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import Loading from "../../../../utils/Loading";
import './acertos-lancamentos.scss'
import { mantemEstadoAnaliseDre as meapcservice } from "../../../../services/mantemEstadoAnaliseDre.service";
import {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc
} from "../../../dres/PrestacaoDeContas/RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";

const AcertosLancamentos = ({
                                analiseAtualUuid,
                                prestacaoDeContas,
                                exibeBtnIrParaPaginaDeAcertos,
                                exibeBtnIrParaPaginaDeReceitaOuDespesa,
                                editavel,
                                prestacaoDeContasUuid
                            }) => {

    const TEMPERMISSAOEDICAOACOMPANHAMENTOPC = RetornaSeTemPermissaoEdicaoAcompanhamentoDePc()

    const rowsPerPageAcertosLancamentos = 5;

    // Hooks Personalizados
    const valor_template = useValorTemplate()
    const dataTemplate = useDataTemplate()
    const numeroDocumentoTemplate = useNumeroDocumentoTemplate()
    const [lancamentosAjustes, setLancamentosAjustes] = useState([])

    const dispatch = useDispatch()

    const history = useHistory();

    const [contasAssociacao, setContasAssociacao] = useState([])
    const [contaSelecionada, setContaSelecionada] = useState([])
    const [loadingLancamentos, setLoadingLancamentos] = useState(true)
    const [opcoesJustificativa, setOpcoesJustificativa] = useState([])
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({});
    const [expandedRowsLancamentos, setExpandedRowsLancamentos] = useState(null);
    const [textareaJustificativa, setTextareaJustificativa] = useState(() => {});
    const [showSalvar, setShowSalvar] = useState({});
    const [txtEsclarecimentoLancamento, setTxtEsclarecimentoLancamento] = useState({});
    const [showSalvarEsclarecimento, setShowSalvarEsclarecimento] = useState({});
    const [totalDeAcertosDosLancamentos, setTotalDeAcertosDosLancamentos] = useState(0)
    const [analisePermiteEdicao, setAnalisePermiteEdicao] = useState()
    const [identificadorCheckboxClicado, setIdentificadorCheckboxClicado] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);

    useEffect(() => {
        let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado()
        let expanded_uuids = dados_analise_dre_usuario_logado.conferencia_de_lancamentos.expanded
        let lista_objetos_expanded = []

        for(let i=0; i<=expanded_uuids.length-1; i++){
            let uuid = expanded_uuids[i]
            let analise_encontrada = lancamentosAjustes.filter((item) => item.analise_lancamento.uuid === uuid)
            lista_objetos_expanded.push(...analise_encontrada)
        }

        if(lista_objetos_expanded.length > 0){
            setExpandedRowsLancamentos(lista_objetos_expanded)
        }

    }, [lancamentosAjustes])

    const carregaDadosDasContasDaAssociacao = useCallback(async () => {
        setLoadingLancamentos(true)
        if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid && analiseAtualUuid) {
            let contas = await getContasDaAssociacaoComAcertosEmLancamentos(prestacaoDeContas.associacao.uuid, analiseAtualUuid);
            setContasAssociacao(contas);

            // Para Manter o Estado
            if (contas.length === 1){
                let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado()
                dados_analise_dre_usuario_logado.conferencia_de_lancamentos.conta_uuid = contas[0].uuid
                meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), dados_analise_dre_usuario_logado)
            }

            setLoadingLancamentos(false)
        }
    }, [prestacaoDeContas, analiseAtualUuid]);

    useEffect(() => {
        carregaDadosDasContasDaAssociacao()
    }, [carregaDadosDasContasDaAssociacao])

    const getTotalDeAcertosDosLancamentos = useCallback(()=>{

        if (lancamentosAjustes && lancamentosAjustes.length > 0){
            let qtde = 0
            lancamentosAjustes.map((lancamento) =>
                qtde += lancamento.analise_lancamento.solicitacoes_de_ajuste_da_analise_total
            )
            setTotalDeAcertosDosLancamentos(qtde)
        }else {
            setTotalDeAcertosDosLancamentos(0)
        }

    }, [lancamentosAjustes])

    useEffect(()=>{
        getTotalDeAcertosDosLancamentos()
    }, [getTotalDeAcertosDosLancamentos])



    const carregaAcertosLancamentos = useCallback(async (conta_uuid, filtrar_por_lancamento = null, filtrar_por_tipo_de_ajuste = null) => {
        salvaObjetoAnaliseDrePorUsuarioLocalStorage(conta_uuid)


        setLoadingLancamentos(true)

        // Aqui TABELA
        const visao = visoesService.getItemUsuarioLogado('visao_selecionada.nome')
        let status_de_realizacao = await getAnaliseLancamentosPrestacaoConta(analiseAtualUuid, visao)

        setAnalisePermiteEdicao(status_de_realizacao.editavel)

        let lancamentos_ajustes = await getLancamentosAjustes(analiseAtualUuid, conta_uuid, filtrar_por_lancamento, filtrar_por_tipo_de_ajuste)
        
        // Necessário para iniciar check box dos lancamentos nao selecionadas
        let lancamentos_com_flag_selecionado = [];
        for(let lancamento=0; lancamento<=lancamentos_ajustes.length-1; lancamento++){
            // Referente a row da tabela
            lancamentos_ajustes[lancamento].analise_lancamento.selecionado = false;

            // Referente aos acertos dentro da row da tabela
            setaCheckBoxSolicitacoes(lancamentos_ajustes[lancamento].analise_lancamento, false)

            lancamentos_com_flag_selecionado.push(lancamentos_ajustes[lancamento])
        }
        
        setOpcoesJustificativa(status_de_realizacao)
        setLancamentosAjustes(lancamentos_com_flag_selecionado)
        setIdentificadorCheckboxClicado(false);
        setQuantidadeSelecionada(0);
        setLoadingLancamentos(false)

    }, [analiseAtualUuid])

    useEffect(() => {
        if (contasAssociacao && contasAssociacao.length > 0) {
            let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado()

            if(dados_analise_dre_usuario_logado && dados_analise_dre_usuario_logado.conferencia_de_lancamentos && dados_analise_dre_usuario_logado.conferencia_de_lancamentos.conta_uuid){
                carregaAcertosLancamentos(dados_analise_dre_usuario_logado.conferencia_de_lancamentos.conta_uuid)
                setContaSelecionada(dados_analise_dre_usuario_logado.conferencia_de_lancamentos.conta_uuid)

                // necessário para selecionar a aba de conta corretamente
                let index_encontrado = null;
                for(let i=0; i<=contasAssociacao.length-1; i++){
                    if(contasAssociacao[i].uuid === dados_analise_dre_usuario_logado.conferencia_de_lancamentos.conta_uuid){
                        index_encontrado = i;
                        break;
                    }
                }
                
                if(index_encontrado !== null){
                    setClickBtnEscolheConta({
                        [index_encontrado]: true
                    });
                }
            }
            else{
                let index = 0;

                carregaAcertosLancamentos(contasAssociacao[index].uuid)
                setContaSelecionada(contasAssociacao[index].uuid)
                setClickBtnEscolheConta({
                    [index]: true
                });
            }
        }
    }, [contasAssociacao, carregaAcertosLancamentos])

    const guardaEstadoExpandedRowsLancamentos = useCallback(() => {
        if(expandedRowsLancamentos){
            let lista = []
            for(let i=0; i<=expandedRowsLancamentos.length-1; i++){
                lista.push(expandedRowsLancamentos[i].analise_lancamento.uuid)
            }
            salvaEstadoExpandedRowsLancamentosLocalStorage(lista)
        }
        
    }, [expandedRowsLancamentos])

    useEffect(() => {
        guardaEstadoExpandedRowsLancamentos()
    }, [guardaEstadoExpandedRowsLancamentos])


    const toggleBtnEscolheConta = (id) => {
        if (id !== Object.keys(clickBtnEscolheConta)[0]) {
            setClickBtnEscolheConta({
                [id]: !clickBtnEscolheConta[id]
            });
        }

        // Zera paginação ao trocar de conta
        let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado();
        dados_analise_dre_usuario_logado.conferencia_de_lancamentos.paginacao_atual = 0
        dados_analise_dre_usuario_logado.conferencia_de_lancamentos.expanded = []
        meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), dados_analise_dre_usuario_logado)
        setExpandedRowsLancamentos(null)
    };

    const limparStatus = async () => {
        setLoadingLancamentos(true)
        let selecionados = getSolicitacoesSelecionadas();
        await postLimparStatusLancamentoPrestacaoConta({"uuids_solicitacoes_acertos_lancamentos": selecionados.map(lanc => lanc.uuid)})
        await carregaAcertosLancamentos(contaSelecionada)
        setLoadingLancamentos(false)
    }

    const marcarComoRealizado = async () => {
        setLoadingLancamentos(true)
        let selecionados = getSolicitacoesSelecionadas();
        let response = await postMarcarComoRealizadoLancamentoPrestacaoConta({"uuids_solicitacoes_acertos_lancamentos": selecionados.map(lanc => lanc.uuid)})
        if (response && !response.todas_as_solicitacoes_marcadas_como_realizado){
            // Reaproveitando o modal CheckNaoPermitido
            setTituloModalCheckNaoPermitido('Não é possível marcar a solicitação como realizada')
            setTextoModalCheckNaoPermitido(`<p>${response.mensagem}</p>`)
            setShowModalCheckNaoPermitido(true)
        }

        await carregaAcertosLancamentos(contaSelecionada)
        setLoadingLancamentos(false)
    }

    const justificarNaoRealizacao = async (textoConfirmadoJustificado) => {
        setLoadingLancamentos(true)
        let selecionados = getSolicitacoesSelecionadas();
        await postJustificarNaoRealizacaoLancamentoPrestacaoConta({
            "uuids_solicitacoes_acertos_lancamentos": selecionados.map(lanc => lanc.uuid),
            "justificativa": textoConfirmadoJustificado
        })
        await carregaAcertosLancamentos(contaSelecionada)
        setLoadingLancamentos(false)
    }

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

    const handleOnClickSalvarJustificativa = (data) => {
        salvarJustificativa(data);
    }

    const possuiSolicitacaoEsclarecimento = (value) => {
        if (value) {
            let solicitacoes = value.filter(element => element.tipo_acerto.categoria === 'SOLICITACAO_ESCLARECIMENTO');
            return solicitacoes.length > 0;
        }
        return false;
    }

    const salvarJustificativa = async (data) => {
        try {
            setLoadingLancamentos(true)
            await postJustificarNaoRealizacaoLancamentoPrestacaoConta({
                "uuids_solicitacoes_acertos_lancamentos": [data],
                "justificativa": textareaJustificativa[data]
            })
            await carregaAcertosLancamentos(contaSelecionada)
            setLoadingLancamentos(false)
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
            "esclarecimento": txtEsclarecimentoLancamento[data.uuid],
            "uuid_solicitacao_acerto": data.uuid
        }
        try {
            await postMarcarComoLancamentoEsclarecido(payload)
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
        dispatch(origemPagina("dre-detalhe-prestacao-de-contas-resumo-acertos"))
        history.push(`/dre-detalhe-prestacao-de-contas-detalhar-acertos/${prestacaoDeContas.uuid}`)
    }

    const redirecionaDetalheAcerto = (lancamento) => {
        if (editavel && TEMPERMISSAOEDICAOACOMPANHAMENTOPC) {
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

        if (editavel && TEMPERMISSAOEDICAOACOMPANHAMENTOPC) {
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

    const salvarDesabilitadosEsclarecimento = (acerto) => {
        return !txtEsclarecimentoLancamento?.[acerto.uuid] || txtEsclarecimentoLancamento?.[acerto.uuid] === acerto.esclarecimentos || showSalvarEsclarecimento?.[acerto.uuid] || !analisePermiteEdicao
    }

    const salvarDesabilitadosJustificativa = (acerto) => {
        return !textareaJustificativa?.[acerto.uuid] || textareaJustificativa?.[acerto.uuid] === acerto.justificativa || showSalvar?.[acerto.uuid] || !analisePermiteEdicao
    }

    const tagColors = {
        'JUSTIFICADO':  '#5C4EF8',
        'REALIZADO': '#198459',
    }

    const tagJustificativa = (acerto) => {
        let status = '-'
        let statusId = acerto.status_realizacao
        if (statusId && statusId !== 'PENDENTE') {
            let nomeStatus = opcoesJustificativa.status_realizacao_solicitacao.find(justificativa => justificativa.id === statusId)
            status = nomeStatus?.nome ?? '-'
        }
        return (
            <div className="tag-justificativa" style={{ backgroundColor: statusId ? tagColors[statusId] : 'none', color: statusId === 'PENDENTE' ? '#000' : '#fff' }}>
                {status}
            </div>
        )
    }

    const rowExpansionTemplateLancamentos = (data) => {
        if (data && data.analise_lancamento && data.analise_lancamento.solicitacoes_de_ajuste_da_analise && data.analise_lancamento.solicitacoes_de_ajuste_da_analise && data.analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.length > 0) {

            return (
                <>
                    {data.analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria, index) => (
                            <Fragment key={index}>

                                {categoria && categoria.acertos.length > 0 &&

                                    <div className="p-3 mb-2 bg-white text-dark container-categorias-acertos">

                                        {categoria.mensagem_inativa &&
                                            <div className='row mb-2'>
                                                <div className='col-12'>
                                                    {barraMensagemCustom.BarraMensagemInativa(categoria.mensagem_inativa)}
                                                </div>
                                            </div>
                                        }

                                        {categoria.requer_ajustes_externos &&
                                            <div className='row mb-2'>
                                                <div className='col-12'>
                                                    {barraMensagemCustom.BarraMensagemAcertoExterno("Acerto externo ao sistema.")}
                                                </div>
                                            </div>
                                        }

                                        {categoria && categoria.acertos.length > 0 && categoria.acertos.map((acerto) => (

                                            <div key={acerto.uuid} className='border-bottom py-2'>

                                                <div className='row'>
                                                    <div className='col-auto'>
                                                        <p className='texto-numero-do-item'><strong>Item: {acerto.ordem}</strong></p>
                                                    </div>
                                                    <div className='col'>
                                                        <p className='mb-0'><strong>Tipo de acerto:</strong></p>
                                                        <p className='mb-0'>{acerto.tipo_acerto.nome}</p>
                                                    </div>

                                                    {acerto.detalhamento ? (
                                                            <div className='col'>
                                                                <p className='mb-0'><strong>Detalhamento:</strong></p>
                                                                <p className='mb-0'>{acerto.detalhamento}</p>
                                                            </div>
                                                        ) :

                                                        <div className='col'>
                                                            <p className='mb-0' style={{color:"#fff"}}><strong>Detalhamento:</strong></p>
                                                        </div>

                                                    }

                                                    <div className='col'>
                                                        <p className='mb-0'><strong>Status:</strong></p>
                                                        {tagJustificativa(acerto)}
                                                    </div>
                                                    {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && visoesService.getPermissoes(["change_analise_dre"]) && prestacaoDeContas.status === "DEVOLVIDA" && analisePermiteEdicao &&
                                                        <div className='col-auto'>
                                                            <input
                                                                type="checkbox"
                                                                id={`acerto_${acerto}`}
                                                                name="topping"
                                                                value={acerto.uuid}
                                                                checked={acerto.selecionado}
                                                                onChange={(event) => tratarSelecionadoIndividual(event, data.analise_lancamento, acerto)}
                                                            />
                                                        </div>
                                                    }
                                                </div>

                                                {acerto.justificativa && (
                                                    <div className="row">
                                                        <div className="col-12" id="pointer-event-all">
                                                            <p><strong>Justificativa</strong></p>
                                                            <textarea
                                                                defaultValue={acerto.justificativa}
                                                                onChange={(event) => handleChangeTextareaJustificativa(event, acerto.uuid)}
                                                                className="form-control"
                                                                rows="3"
                                                                id="justificativa"
                                                                name="justificativa"
                                                                placeholder="Escreva o comentário"
                                                                disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA' || !analisePermiteEdicao}
                                                            >
                                                            </textarea>
                                                            <div className="bd-highlight d-flex justify-content-end align-items-center">

                                                                {showSalvar?.[acerto.uuid] &&
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
                                                                    disabled={salvarDesabilitadosJustificativa(acerto)}
                                                                    type="button"
                                                                    className={`btn btn-${salvarDesabilitadosJustificativa(acerto) ? 'secondary' : 'success'} mt-2 mb-0`}
                                                                    onClick={() => handleOnClickSalvarJustificativa(acerto.uuid)}
                                                                >
                                                                    <strong>Salvar Justificativas</strong>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {possuiSolicitacaoEsclarecimento(categoria.acertos) &&
                                                    <div className="row">
                                                        <div className="col-12 py-3" id="pointer-event-all">
                                                            <div
                                                                className='titulo-row-expanded-conferencia-de-lancamentos mb-4'>
                                                                <p className='mb-1'><strong>Esclarecimento de lançamento</strong></p>
                                                            </div>
                                                            <textarea
                                                                rows="4"
                                                                cols="50"
                                                                name='esclarecimento'
                                                                defaultValue={acerto.esclarecimentos}
                                                                onChange={(event) => handleChangeTextareaEsclarecimentoLancamento(event, acerto.uuid)}
                                                                className="form-control"
                                                                placeholder="Digite aqui o esclarecimento"
                                                                disabled={![['change_analise_dre']].some(visoesService.getPermissoes) || visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' || prestacaoDeContas.status !== 'DEVOLVIDA' || !analisePermiteEdicao}
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                <div className="bd-highlight d-flex justify-content-end align-items-center" id="pointer-event-all">
                                                    {showSalvarEsclarecimento?.[acerto.uuid] &&
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
                                                    {possuiSolicitacaoEsclarecimento(categoria.acertos) &&
                                                        <button
                                                            disabled={salvarDesabilitadosEsclarecimento(acerto)}
                                                            type="button"
                                                            className={`btn btn-${salvarDesabilitadosEsclarecimento(acerto) ? 'secondary' : 'success'} mb-0 mr-2`}
                                                            onClick={() => marcarComoEsclarecido(acerto)}
                                                        >
                                                            <strong>Salvar esclarecimento</strong>
                                                        </button>
                                                    }
                                                </div>

                                            </div>


                                        ))
                                        }

                                        <BotoesDetalhesParaAcertosDeCategorias
                                            analise_lancamento={categoria}
                                            prestacaoDeContasUuid={prestacaoDeContasUuid}
                                            prestacaoDeContas={prestacaoDeContas}
                                            tipo_transacao={data.tipo_transacao}
                                            analisePermiteEdicao={analisePermiteEdicao}
                                        />

                                    </div>
                                }


                            </Fragment>


                        )
                    )}


                    {exibeBtnIrParaPaginaDeAcertos &&
                        redirecionaDetalheAcerto(data)
                    }
                    {exibeBtnIrParaPaginaDeReceitaOuDespesa &&
                        redirecionaDetalheReceitaOuDespesa(data)
                    }

                </>
            )
        }
    };

    // ################# Vieram da Tabela #################

    const [tituloModalCheckNaoPermitido, setTituloModalCheckNaoPermitido] = useState('Seleção não permitida')
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)

    const selecionarTodosGlobal = (e) => {
        if(identificadorCheckboxClicado){
            let result = lancamentosAjustes.reduce((acc, o) => {
                let obj_completo = o;
                obj_completo.analise_lancamento.selecionado = false;

                setaCheckBoxSolicitacoes(obj_completo.analise_lancamento, false);

                acc.push(obj_completo);
                return acc;
            }, [])
    
            setLancamentosAjustes(result);
            setIdentificadorCheckboxClicado(false);
            
            let qtde = getQuantidadeAcertosSelecionados();
            setQuantidadeSelecionada(qtde);
        }
        else{
            let result = lancamentosAjustes.reduce((acc, o) => {
                let obj_completo = o;
                obj_completo.analise_lancamento.selecionado = true;

                setaCheckBoxSolicitacoes(obj_completo.analise_lancamento, true);
            
                acc.push(obj_completo);
                return acc;
            }, [])
    
            setLancamentosAjustes(result);
            setIdentificadorCheckboxClicado(true);
            
            let qtde = getQuantidadeAcertosSelecionados();
            setQuantidadeSelecionada(qtde)
        }
    }

    const tratarSelecionado = (e, analiseLancamentoUuid) => {
        let result2 = lancamentosAjustes.reduce((acc, o) => {
            let obj_completo = o;

            if(obj_completo.analise_lancamento.uuid === analiseLancamentoUuid){
                obj_completo.analise_lancamento.selecionado = e.target.checked;

                setaCheckBoxSolicitacoes(obj_completo.analise_lancamento, e.target.checked)

                if(todosLancamentosCheckados()){
                    setIdentificadorCheckboxClicado(true);
                }
                else{
                    setIdentificadorCheckboxClicado(false);
                }
            }
        
            acc.push(obj_completo);
            return acc;
        }, []);
        setLancamentosAjustes(result2);
        
        let qtde = getQuantidadeAcertosSelecionados();
        setQuantidadeSelecionada(qtde);
    }

    const todosLancamentosCheckados = () => {
        let total_lancamentos = lancamentosAjustes.length;
        let total_lancamentos_selecionados = 0;
        
        let lancamentos_selecionados = lancamentosAjustes.filter(element => element.analise_lancamento.selecionado === true);
        
        if(lancamentos_selecionados.length > 0){
            total_lancamentos_selecionados = lancamentos_selecionados.length;
        }

        
        if(total_lancamentos === total_lancamentos_selecionados){
            return true;
        }

        return false;
    }

    const todosAcertosCheckados = (analiseLancamento) => {
        let solicitacoes_acerto_por_categoria = analiseLancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria;
        let total_acertos = analiseLancamento.solicitacoes_de_ajuste_da_analise_total;
        let total_selecionados = 0;

        for(let i=0; i<=solicitacoes_acerto_por_categoria.length-1; i++){
            let solicitacao = solicitacoes_acerto_por_categoria[i];

            let acertos_selecionados = solicitacao.acertos.filter(element => element.selecionado === true)
            if(acertos_selecionados.length > 0){
                total_selecionados = total_selecionados + acertos_selecionados.length
            }
        }

        if(total_acertos === total_selecionados){
            return true;
        }

        return false;
    }

    const selecionarTodosItensDosLancamentosGlobal = () => {
        return (
            <div className="align-middle">
                <input
                    checked={identificadorCheckboxClicado}
                    type="checkbox"
                    value=""
                    onChange={(e) => selecionarTodosGlobal(e.target)}
                    name="checkHeader"
                    id="checkHeader"
                    disabled={false}
                />
            </div>
        )
    }

    const selecionarTodosItensDoLancamentoRow = (rowData) => {
        return (
            <input
                checked={lancamentosAjustes.filter(element => element.analise_lancamento.uuid === rowData.analise_lancamento.uuid)[0].analise_lancamento.selecionado}
                type="checkbox"
                value=""
                onChange={(e) => tratarSelecionado(e, rowData.analise_lancamento.uuid)}
                name="checkHeader"
                id="checkHeader"
                disabled={false}
            />
        );
    }

    const tratarSelecionadoIndividual = (e, analiseLancamento, acerto) => {
        
        let result2 = lancamentosAjustes.reduce((acc, o) => {
            let obj_completo = o;

            if(obj_completo.analise_lancamento.uuid === analiseLancamento.uuid){
                let solicitacoes_acerto_por_categoria = obj_completo.analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria; 
                
                for(let i=0; i<=solicitacoes_acerto_por_categoria.length-1; i++){
                    let acertos = solicitacoes_acerto_por_categoria[i].acertos;

                    for(let x=0; x<=acertos.length-1; x++){
                        if(acertos[x].uuid === acerto.uuid){
                            acertos[x].selecionado = e.target.checked;

                            if(todosAcertosCheckados(analiseLancamento)){
                                obj_completo.analise_lancamento.selecionado = true;

                                if(todosLancamentosCheckados()){
                                    setIdentificadorCheckboxClicado(true);
                                }
                                else{
                                    setIdentificadorCheckboxClicado(false);
                                }
                            }
                            else{
                                obj_completo.analise_lancamento.selecionado = false;
                                
                                if(todosLancamentosCheckados()){
                                    setIdentificadorCheckboxClicado(true);
                                }
                                else{
                                    setIdentificadorCheckboxClicado(false);
                                }
                            }
                        }
                    }
                }
                
            }
        
            acc.push(obj_completo);
            return acc;
        }, []);

        setLancamentosAjustes(result2);
        
        let qtde = getQuantidadeAcertosSelecionados();
        setQuantidadeSelecionada(qtde);
    }

    const setaCheckBoxSolicitacoes = (analise_lancamento, flag) => {
        let solicitacoes_acerto_por_categoria = analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria;

        for(let solicitacao=0; solicitacao<=solicitacoes_acerto_por_categoria.length-1; solicitacao++){
            let acertos = solicitacoes_acerto_por_categoria[solicitacao].acertos;

            for(let acerto=0; acerto<=acertos.length-1; acerto++){
                acertos[acerto].selecionado = flag;
            }
        }
    }

    const getQuantidadeAcertosSelecionados = () => {
        let quantidade = 0;

        for(let i=0; i<=lancamentosAjustes.length-1; i++){
            let analise_lancamento = lancamentosAjustes[i].analise_lancamento;

            let solicitacoes_acerto_por_categoria = analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria;
        
            for(let x=0; x<=solicitacoes_acerto_por_categoria.length-1; x++){
                let solicitacao = solicitacoes_acerto_por_categoria[x];
                let acertos_selecionados = solicitacao.acertos.filter(element => element.selecionado === true)
    
                if(acertos_selecionados.length > 0){
                    quantidade = quantidade + acertos_selecionados.length;
                }
            }
        
        }

        return quantidade;
    }

    const acoesDisponiveis = () => {
        let selecionados = getSolicitacoesSelecionadas();
        
        let status_selecionados = {
            JUSTIFICADO_E_REALIZADO: false,
            REALIZADO_E_PENDENTE: false,
            JUSTIFICADO_E_REALIZADO_E_PENDENTE: false,
            JUSTIFICADO_E_PENDENTE: false,
            
            REALIZADO: false,
            JUSTIFICADO: false,
            PENDENTE: false
        }

        let selecionados_status_pendente = selecionados.filter(element => element.status_realizacao === "PENDENTE");
        let selecionados_status_justificado = selecionados.filter(element => element.status_realizacao === "JUSTIFICADO");
        let selecionados_status_realizado = selecionados.filter(element => element.status_realizacao === "REALIZADO");
        
        // Logica status conjuntos
        if(selecionados_status_justificado.length > 0 && selecionados_status_realizado.length > 0 && selecionados_status_pendente.length === 0){
            status_selecionados.JUSTIFICADO_E_REALIZADO = true;
        }
        else if(selecionados_status_realizado.length > 0 && selecionados_status_pendente.length > 0 && selecionados_status_justificado.length === 0){
            status_selecionados.REALIZADO_E_PENDENTE = true;
        }
        else if(selecionados_status_justificado.length > 0 && selecionados_status_realizado.length > 0 && selecionados_status_pendente.length > 0){
            status_selecionados.JUSTIFICADO_E_REALIZADO_E_PENDENTE = true;
        }
        else if(selecionados_status_justificado.length > 0 && selecionados_status_pendente.length > 0 && selecionados_status_realizado.length === 0){
            status_selecionados.JUSTIFICADO_E_PENDENTE = true;
        }
        // Logica status individuais
        else if(selecionados_status_realizado.length > 0 && selecionados_status_justificado.length === 0 && selecionados_status_pendente.length === 0){
            status_selecionados.REALIZADO = true;
        }
        else if(selecionados_status_justificado.length > 0 && selecionados_status_realizado.length === 0 && selecionados_status_pendente.length === 0){
            status_selecionados.JUSTIFICADO = true;
        }
        else if(selecionados_status_pendente.length > 0 && selecionados_status_realizado.length === 0 && selecionados_status_justificado.length === 0){
            status_selecionados.PENDENTE = true;
        }
        
        return status_selecionados;
    }

    const getSolicitacoesSelecionadas = () => {
        let selecionados = [];

        for(let i=0; i<=lancamentosAjustes.length-1; i++){
            let analise_lancamento = lancamentosAjustes[i].analise_lancamento;

            let solicitacoes_acerto_por_categoria = analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria;
        
            for(let x=0; x<=solicitacoes_acerto_por_categoria.length-1; x++){
                let solicitacao = solicitacoes_acerto_por_categoria[x];
                let acertos_selecionados = solicitacao.acertos.filter(element => element.selecionado === true)
    
                if(acertos_selecionados.length > 0){
                    selecionados.push(...acertos_selecionados)
                }
            }
        }

        return selecionados;
    }

    const acaoCancelar = () => {
        let lancamentos_com_flag_selecionado = [];
        let lancamentos_ajustes = lancamentosAjustes;

        for(let lancamento=0; lancamento<=lancamentos_ajustes.length-1; lancamento++){
            lancamentos_ajustes[lancamento].analise_lancamento.selecionado = false;
            
            setaCheckBoxSolicitacoes(lancamentos_ajustes[lancamento].analise_lancamento, false)
            lancamentos_com_flag_selecionado.push(lancamentos_ajustes[lancamento])
        }

        setLancamentosAjustes(lancamentos_com_flag_selecionado);
        setIdentificadorCheckboxClicado(false);
        setQuantidadeSelecionada(0);

    }

    // ################# FIM Vieram da Tabela

    const salvaObjetoAnaliseDrePorUsuarioLocalStorage = (conta_uuid_lancamentos) =>{
        let objetoAnaliseDrePorUsuario = meapcservice.getAnaliseDreUsuarioLogado();

        objetoAnaliseDrePorUsuario.conferencia_de_lancamentos.conta_uuid = conta_uuid_lancamentos
        meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), objetoAnaliseDrePorUsuario)
    }

    const salvaEstadoExpandedRowsLancamentosLocalStorage = (lista) => {
        let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado();
        dados_analise_dre_usuario_logado.conferencia_de_lancamentos.expanded = lista
        meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), dados_analise_dre_usuario_logado)
    }

    return (
        <>
            <h5 className="mb-4 mt-4"><strong>Acertos nos lançamentos</strong></h5>
            {loadingLancamentos ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <>
                <nav>
                    <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">
                        {contasAssociacao && contasAssociacao && contasAssociacao.length > 0 && contasAssociacao.map((conta, indexTabs) =>
                            <Fragment key={`key_${conta.uuid}`}>
                                <a
                                    onClick={() => {
                                        setContaSelecionada(conta.uuid)
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
                            selecionarTodosItensDosLancamentosGlobal={selecionarTodosItensDosLancamentosGlobal}
                            selecionarTodosItensDoLancamentoRow={selecionarTodosItensDoLancamentoRow}
                            tituloModalCheckNaoPermitido={tituloModalCheckNaoPermitido}
                            textoModalCheckNaoPermitido={textoModalCheckNaoPermitido}
                            showModalCheckNaoPermitido={showModalCheckNaoPermitido}
                            setShowModalCheckNaoPermitido={setShowModalCheckNaoPermitido}
                            totalDeAcertosDosLancamentos={totalDeAcertosDosLancamentos}
                            analisePermiteEdicao={analisePermiteEdicao}
                            quantidadeSelecionada={quantidadeSelecionada}
                            acoesDisponiveis={acoesDisponiveis}
                            acaoCancelar={acaoCancelar}
                        />
                    </div>
                </div>
                </>
            }
        </>
    )
}
export default memo(AcertosLancamentos)