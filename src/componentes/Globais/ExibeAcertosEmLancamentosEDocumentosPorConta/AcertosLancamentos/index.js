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
import Dropdown from "react-bootstrap/Dropdown";
import { useContext } from "react";
import { AnaliseDREContext } from "../../../../context/AnaliseDRE";
import { mantemEstadoAnaliseDre as meapcservice } from "../../../../services/mantemEstadoAnaliseDre.service";

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
    //const {lancamentosAjustes, setLancamentosAjustes} = useContext(AnaliseDREContext)
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

        setOpcoesJustificativa(status_de_realizacao)
        setLancamentosAjustes(lancamentos_ajustes)

        
        setLancamentosSelecionados([])
        setIdentificadorCheckboxClicado([{
            uuid: ''
        }])
        setLoadingLancamentos(false)

    }, [analiseAtualUuid, setLancamentosAjustes])

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
        await postLimparStatusLancamentoPrestacaoConta({"uuids_solicitacoes_acertos_lancamentos": lancamentosSelecionados.map(lanc => lanc.uuid)})
        await carregaAcertosLancamentos(contaSelecionada)
        setLoadingLancamentos(false)
    }

    const marcarComoRealizado = async () => {
        setLoadingLancamentos(true)
        let response = await postMarcarComoRealizadoLancamentoPrestacaoConta({"uuids_solicitacoes_acertos_lancamentos": lancamentosSelecionados.map(lanc => lanc.uuid)})
        if (response && !response.todas_as_solicitacoes_marcadas_como_realizado){
            // Reaproveitando o modal CheckNaoPermitido
            setTituloModalCheckNaoPermitido('Solicitações marcadas como realizado')
            setTextoModalCheckNaoPermitido(`<p>${response.mensagem}</p>`)
            setShowModalCheckNaoPermitido(true)
        }

        await carregaAcertosLancamentos(contaSelecionada)
        setLoadingLancamentos(false)
    }

    const justificarNaoRealizacao = async (textoConfirmadoJustificado) => {
        setLoadingLancamentos(true)
        await postJustificarNaoRealizacaoLancamentoPrestacaoConta({
            "uuids_solicitacoes_acertos_lancamentos": lancamentosSelecionados.map(lanc => lanc.uuid),
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

                                        {categoria && categoria.acertos.length > 1 &&
                                            <div className='mb-0 text-right border-bottom'>
                                                {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && visoesService.getPermissoes(["change_analise_dre"]) && prestacaoDeContas.status === "DEVOLVIDA" && analisePermiteEdicao &&
                                                    selecionarTodosItensDaCategoriaDoLancamento(categoria)
                                                }
                                            </div>
                                        }

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
                                                                checked={lancamentosSelecionados.includes(acerto)}
                                                                onChange={(event) => selecionarItemIndividual(event, acerto, acerto.status_realizacao)}
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

    const [lancamentosSelecionados, setLancamentosSelecionados] = useState([])
    const [tituloModalCheckNaoPermitido, setTituloModalCheckNaoPermitido] = useState('Seleção não permitida')
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)

    const [identificadorCheckboxClicado, setIdentificadorCheckboxClicado] = useState([{
            uuid: '',
        }])

    const [status, setStatus] = useState()

    const limparLancamentos = ({rowData, categoria}) => {

        if (categoria){
            // eslint-disable-next-line array-callback-return
            categoria.acertos.map((acerto) => {
                    setLancamentosSelecionados((current) => current.filter((item) => item !== acerto));
                }
            )
            setIdentificadorCheckboxClicado((current) => current.filter((item) => item.uuid !== categoria.categoria));

        }else if (rowData){
            rowData.analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria) =>
                // eslint-disable-next-line array-callback-return
                categoria.acertos.map((acerto) => {
                        setLancamentosSelecionados((current) => current.filter((item) => item !== acerto));
                    }
                )
            )
            setIdentificadorCheckboxClicado((current) => current.filter((item) => item.uuid !== rowData.analise_lancamento.uuid))

        }else {
            setLancamentosSelecionados([])
            setIdentificadorCheckboxClicado([{
                uuid: '',
            }])
        }
    }

    const verificaSePodeSerSelecionado = (statusId) => {
        if (lancamentosSelecionados && lancamentosSelecionados.length > 0){
            if (lancamentosSelecionados[0].status_realizacao !== statusId){
                setTituloModalCheckNaoPermitido('Seleção não permitida')
                setTextoModalCheckNaoPermitido('<p>Esse lançamento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>')
                setShowModalCheckNaoPermitido(true)
                return false
            }else {
                return true
            }
        }else {
            return true
        }
    }

    const selecionarPorStatusTodosItensDosLancamentos = (event, statusId) => {
        event.preventDefault()

        lancamentosAjustes.map((lancamento) =>
            lancamento.analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria) =>
                // eslint-disable-next-line array-callback-return
                categoria.acertos.map((acerto) => {

                    if (verificaSePodeSerSelecionado(statusId)) {

                        setStatus(statusId)

                        if (acerto.status_realizacao === statusId) {
                            if (!lancamentosSelecionados.includes(acerto)) {
                                setLancamentosSelecionados((array) => [...array, acerto]);
                            }
                        } else {
                            setLancamentosSelecionados((current) => current.filter((item) => item !== acerto));
                        }
                    }
                })
            )
        )
        if (verificaSePodeSerSelecionado(statusId)) {
            setIdentificadorCheckboxClicado((array) => [...array, {uuid: 'TODOS'}]);
        }
    }

    const selecionarTodosItensDosLancamentos = () => {
        return (
            <div className="align-middle">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="p-0">
                        <input
                            checked={identificadorCheckboxClicado.some(uuid => uuid.uuid === 'TODOS') && lancamentosSelecionados.length > 0}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeader"
                            id="checkHeader"
                            disabled={false}
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="super-colors" id='dropdown-menu-tabela-acertos-lancamentos'>
                        <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDosLancamentos(e, 'REALIZADO')}>Selecionar todos realizados</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDosLancamentos(e, 'JUSTIFICADO')}>Selecionar todos justificados</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDosLancamentos(e, 'PENDENTE')}>Selecionar todos sem status </Dropdown.Item>
                        <Dropdown.Item onClick={()=>limparLancamentos({rowData: null, categoria: null}) }>Desmarcar todos</Dropdown.Item>
                    </Dropdown.Menu>

                </Dropdown>
            </div>
        )
    }

    const selecionarPorStatusTodosItensDoLancamento = (event, statusId, rowData) => {
        event.preventDefault()

        rowData.analise_lancamento.solicitacoes_de_ajuste_da_analise.solicitacoes_acerto_por_categoria.map((categoria) =>
            // eslint-disable-next-line array-callback-return
            categoria.acertos.map((acerto) => {

                if (verificaSePodeSerSelecionado(statusId)) {

                    setStatus(statusId)

                    if (acerto.status_realizacao === statusId) {
                        if (!lancamentosSelecionados.includes(acerto)) {
                            setLancamentosSelecionados((array) => [...array, acerto]);
                        }
                    } else {
                        setLancamentosSelecionados((current) => current.filter((item) => item !== acerto));
                    }
                }
            })
        )
        if (verificaSePodeSerSelecionado(statusId)) {
            setIdentificadorCheckboxClicado((array) => [...array, {uuid: rowData.analise_lancamento.uuid}]);
        }
    }

    const selecionarTodosItensDoLancamento = (rowData) => {

        return (
            <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                    <input
                        checked={ (identificadorCheckboxClicado.some(uuid => uuid.uuid === 'TODOS') && lancamentosSelecionados.length > 0 ) || (identificadorCheckboxClicado.some(uuid => uuid.uuid === rowData.analise_lancamento.uuid) && lancamentosSelecionados.length > 0) }
                        type="checkbox"
                        value=""
                        onChange={(e) => e}
                        name="checkHeader"
                        id="checkHeader"
                        disabled={false}
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu className="super-colors" id='dropdown-menu-tabela-acertos-lancamentos'>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDoLancamento(e, 'REALIZADO', rowData)}>Selecionar todos realizados</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDoLancamento(e, 'JUSTIFICADO', rowData)}>Selecionar todos justificados</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDoLancamento(e, 'PENDENTE', rowData)}>Selecionar todos sem status </Dropdown.Item>
                    <Dropdown.Item onClick={()=>limparLancamentos({rowData: rowData, categoria: null})}>Desmarcar todos</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    const selecionarPorStatusTodosItensDaCategoriaDoLancamento = (event, statusId, categoria) => {
        event.preventDefault()

        // eslint-disable-next-line array-callback-return
        categoria.acertos.map((acerto) => {
            if (verificaSePodeSerSelecionado(statusId)){
                setStatus(statusId)
                if (acerto.status_realizacao === statusId) {
                    if (!lancamentosSelecionados.includes(acerto)) {
                        setLancamentosSelecionados((array) => [...array, acerto]);
                    }
                }else {
                    setLancamentosSelecionados((current) => current.filter((item) => item !== acerto));
                }
            }
        }
    )
        if (verificaSePodeSerSelecionado(statusId)) {
            setIdentificadorCheckboxClicado((array) => [...array, {uuid: categoria.categoria}]);
        }
}

    const selecionarTodosItensDaCategoriaDoLancamento = (categoria) => {

        return (
            <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                    <span>Selecionar todos </span>
                    <input
                        checked={identificadorCheckboxClicado.some(uuid => uuid.uuid === categoria.categoria) && lancamentosSelecionados.length > 0 }
                        type="checkbox"
                        value=""
                        onChange={(e) => e}
                        name="checkHeader"
                        id="checkHeader"
                        disabled={false}
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu className="super-colors" id='dropdown-menu-tabela-acertos-lancamentos'>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDaCategoriaDoLancamento(e, 'REALIZADO', categoria)}>Selecionar todos realizados</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDaCategoriaDoLancamento(e, 'JUSTIFICADO', categoria)}>Selecionar todos justificados</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => selecionarPorStatusTodosItensDaCategoriaDoLancamento(e, 'PENDENTE', categoria)}>Selecionar todos sem status </Dropdown.Item>
                    <Dropdown.Item onClick={() => limparLancamentos({rowData: null, categoria: categoria})}>Desmarcar todos</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    const selecionarItemIndividual = (event, acerto, statusId) => {

        if (verificaSePodeSerSelecionado(statusId)){
            setStatus(statusId)
            if (!lancamentosSelecionados.includes(acerto)) {
                setLancamentosSelecionados((array) => [...array, acerto]);
            }else {
                setLancamentosSelecionados((current) => current.filter((item) => item !== acerto));
            }
        }
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
                            lancamentosSelecionados={lancamentosSelecionados}
                            status={status}
                            setLancamentosSelecionados={setLancamentosSelecionados}
                            selecionarTodosItensDosLancamentos={selecionarTodosItensDosLancamentos}
                            selecionarTodosItensDoLancamento={selecionarTodosItensDoLancamento}
                            limparLancamentos={limparLancamentos}
                            tituloModalCheckNaoPermitido={tituloModalCheckNaoPermitido}
                            textoModalCheckNaoPermitido={textoModalCheckNaoPermitido}
                            showModalCheckNaoPermitido={showModalCheckNaoPermitido}
                            setShowModalCheckNaoPermitido={setShowModalCheckNaoPermitido}
                            totalDeAcertosDosLancamentos={totalDeAcertosDosLancamentos}
                            analisePermiteEdicao={analisePermiteEdicao}
                        />
                    </div>
                </div>
                </>
            }
        </>
    )
}
export default memo(AcertosLancamentos)