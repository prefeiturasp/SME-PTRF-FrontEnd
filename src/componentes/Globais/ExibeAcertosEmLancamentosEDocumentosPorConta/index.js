import React, {Fragment, memo, useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import useValorTemplate from "../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate";
import useDataTemplate from "../../../hooks/Globais/useDataTemplate";
import useNumeroDocumentoTemplate from "../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate";
import {getContasDaAssociacao, getDocumentosAjustes, getLancamentosAjustes, getTiposDeAcertoLancamentos, getExtratosBancariosAjustes, getTemAjustesExtratos} from "../../../services/dres/PrestacaoDeContas.service";
import {TabelaAcertosLancamentos} from "./TabelaAcertosLancamentos";
import TabsAcertosEmLancamentosPorConta from "./TabsAcertosEmLancamentosPorConta";
import Loading from "../../../utils/Loading";
import { 
    postLimparStatusLancamentoPrestacaoConta,
    postJustificarNaoRealizacaoLancamentoPrestacaoConta,
    postMarcarComoRealizadoLancamentoPrestacaoConta,
    patchAnaliseLancamentoPrestacaoConta
} from "../../../services/dres/PrestacaoDeContas.service";

// Redux
import {useDispatch} from "react-redux";
import {addDetalharAcertos, limparDetalharAcertos} from "../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions"

import TabelaAcertosDocumentos from "./TabelaAcertosDocumentos";
import { getAnaliseLancamentosPrestacaoConta } from "../../../services/dres/PrestacaoDeContas.service";


// Hooks Personalizados
import {useCarregaPrestacaoDeContasPorUuid} from "../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import TabsAjustesEmExtratosBancarios from "./TabsAjustesEmExtratosBancarios";
import TabelaAcertosEmExtratosBancarios from "./TabelaAcertosEmExtratosBancarios";
import {visoesService} from "../../../services/visoes.service";

const ExibeAcertosEmLancamentosEDocumentosPorConta = ({exibeBtnIrParaPaginaDeAcertos=true, exibeBtnIrParaPaginaDeReceitaOuDespesa=false, prestacaoDeContasUuid, analiseAtualUuid, editavel}) => {

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
    const [lancamentosDocumentos, setLancamentosDocumentos] = useState([])
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
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0:true});
    const [clickBtnEscolheContaExtratosBancarios, setClickBtnEscolheContaExtratosBancarios] = useState({0:true});
    const [textareaJustificativa, setTextareaJustificativa] = useState(() => {});
    const [showSalvar, setShowSalvar] = useState({});


    const toggleBtnEscolheConta = (id) => {
        if (id !== Object.keys(clickBtnEscolheConta)[0]){
            setClickBtnEscolheConta({
                [id]: !clickBtnEscolheConta[id]
            });
        }
    };

    const toggleBtnEscolheContaExtratosBancarios = (id) => {
        if (id !== Object.keys(clickBtnEscolheContaExtratosBancarios)[0]){
            setClickBtnEscolheContaExtratosBancarios({
                [id]: !clickBtnEscolheContaExtratosBancarios[id]
            });
        }
    };

    const carregaDadosDasContasDaAssociacao = useCallback(async () =>{
        if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid){
            let contas = await getContasDaAssociacao(prestacaoDeContas.associacao.uuid);
            setContasAssociacao(contas);
        }
    }, [prestacaoDeContas]);

    useEffect(()=>{
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

        if(tem_ajustes_extratos && tem_ajustes_extratos.length > 0){
            setExibeAcertosNosExtratos(true);
        }
        else{
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

    const carregaAcertosLancamentos = useCallback(async (conta_uuid, filtrar_por_lancamento=null, filtrar_por_tipo_de_ajuste=null) => {
        setContaUuid(conta_uuid)
        setLoadingLancamentos(true)
        let { status_realizacao } = await getAnaliseLancamentosPrestacaoConta()
        let lancamentos_ajustes = await getLancamentosAjustes(analiseAtualUuid, conta_uuid, filtrar_por_lancamento, filtrar_por_tipo_de_ajuste)

        setOpcoesJustificativa(status_realizacao)
        setLancamentosAjustes(lancamentos_ajustes)
        setLoadingLancamentos(false)
    }, [analiseAtualUuid])

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

    const carregaAcertosDocumentos = useCallback(async () => {
        let documentos_ajustes = await getDocumentosAjustes(analiseAtualUuid)
        setLancamentosDocumentos(documentos_ajustes)
        setLoadingDocumentos(false)
    }, [analiseAtualUuid])


    useEffect(() => {
        if (contasAssociacao && contasAssociacao.length > 0){
            // TODO Rever os métodos consultaSeTemAjustesExtratos. Repete a consulta da API feira por carregarAjustesExtratosBancarios
            consultaSeTemAjustesExtratos();
            carregarAjustesExtratosBancarios(contasAssociacao[0].uuid);
            carregaAcertosLancamentos(contasAssociacao[0].uuid)
            carregaAcertosDocumentos(contasAssociacao[0].uuid)
            setClickBtnEscolheConta({0: true})
        }
    }, [contasAssociacao, carregaAcertosLancamentos, carregaAcertosDocumentos, carregarAjustesExtratosBancarios])

    useEffect(() => {

        let mounted = true;

        const carregaTiposDeAcertoLancamentos = async () => {
            if (mounted){
                let tipos_de_acerto_lancamentos = await getTiposDeAcertoLancamentos()
                setListaTiposDeAcertoLancamentos(tipos_de_acerto_lancamentos)
            }
        }
        carregaTiposDeAcertoLancamentos()

        return () =>{
            mounted = false;
        }

    }, [])

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltros = async () => {
        await carregaAcertosLancamentos(contaUuid, stateFiltros.filtrar_por_lancamento, stateFiltros.filtrar_por_tipo_de_ajuste)
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaAcertosLancamentos(contaUuid)
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

    const handleOnClick = (data) => {
        salvarJustificativa(data);
    }

    const salvarJustificativa = async (data) => {
        let payload = {
            'justificativa': textareaJustificativa[data],
        }

        try {
            await patchAnaliseLancamentoPrestacaoConta(payload, data)
            setShowSalvar({
                ...showSalvar,
                [data]: true
            });
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    const rowExpansionTemplateLancamentos = (data) => {
        if (data && data.analise_lancamento && data.analise_lancamento.solicitacoes_de_ajuste_da_analise && data.analise_lancamento.solicitacoes_de_ajuste_da_analise.length > 0) {
            const salvarDesabilitados = !textareaJustificativa?.[data.analise_lancamento.uuid] || textareaJustificativa?.[data.analise_lancamento.uuid] === data.analise_lancamento.justificativa || showSalvar?.[data.analise_lancamento.uuid]
            return (
                <>
                    {data.analise_lancamento.solicitacoes_de_ajuste_da_analise.map((ajuste, index) => (
                        <Fragment key={ajuste.id}>
                            {data.analise_lancamento.justificativa?.length > 0 && ( 
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
                                                                    style={{fontSize: '16px', color:'#297805'}}
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
                                                        onClick={() => handleOnClick(data.analise_lancamento.uuid)}
                                                        >
                                                            <strong>Salvar Justificativas</strong>
                                                    </button>
                                                </div>
                                    </div>
                            </div>
                            )}
                            <div className='row'>
                                <div className='col-12 px-4 py-2'>
                                    <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                        <p className='mb-1'><strong>Item {index + 1}</strong></p>
                                    </div>
                                    <p className='mb-1'><strong>Tipo de acerto</strong></p>
                                    <p>{ajuste.tipo_acerto.nome}</p>
                                    <p className='mb-1'><strong>Detalhamento</strong></p>
                                    <p className='mb-0'>{ajuste.detalhamento}</p>
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
                </>
            )
        }
    };

    const rowExpansionTemplateDocumentos = (data) => {
        if (data && data.solicitacoes_de_ajuste_da_analise && data.solicitacoes_de_ajuste_da_analise.length > 0) {
            return (
                data.solicitacoes_de_ajuste_da_analise.map((ajuste, index) => (
                    <div className='row p-2' style={{overflow: 'hidden'}} key={ajuste.id}>
                        <div className='col-12'>
                            <div className='titulo-row-expanded-conferencia-de-lancamentos mb-3'>
                                <p className='mb-1'><strong>Item {index + 1}</strong></p>
                            </div>
                            <p className='mb-1'><strong>Tipo de acerto</strong></p>
                            <p>{ajuste.tipo_acerto.nome}</p>
                            <p className='mb-1'><strong>Detalhamento</strong></p>
                            <p className='mb-0'>{ajuste.detalhamento}</p>
                        </div>
                    </div>
                ))
            )
        }
    };

    const addDispatchRedireciona = (lancamentos) => {
        dispatch(limparDetalharAcertos())
        dispatch(addDetalharAcertos(lancamentos))
        history.push(`/dre-detalhe-prestacao-de-contas-detalhar-acertos/${prestacaoDeContas.uuid}`)
    }

    const redirecionaDetalheAcerto = (lancamento) => {
        if (editavel){
            return(
                <p className='text-right border-top pt-3'><button onClick={()=>addDispatchRedireciona(lancamento)} className='btn btn-outline-success'><strong>Ir para página de acertos</strong></button></p>
            )
        }

    }

    const redirecionaPaginaDespesaOuReceita = (data) => {
        let url;
        if (data && data.tipo_transacao === 'Gasto' && data.documento_mestre){
            if (data.documento_mestre.receitas_saida_do_recurso) {
                url = `/cadastro-de-despesa-recurso-proprio/${data.documento_mestre.receitas_saida_do_recurso}/${data.documento_mestre.uuid}`
            } else {
                url = '/edicao-de-despesa/' + data.documento_mestre.uuid;
            }
        }else if (data.tipo_transacao === 'Crédito' && data.documento_mestre){
            url = `/edicao-de-receita/${data.documento_mestre.uuid}`
        }
        history.push(url)
    };

    const redirecionaDetalheReceitaOuDespesa = (data) =>{

        if (editavel){
            let tipo_de_transacao;
            if (data.tipo_transacao === 'Gasto'){
                tipo_de_transacao = 'despesa'
            }else if (data.tipo_transacao === 'Crédito'){
                tipo_de_transacao = 'receita'
            }
            return(
                <p className='text-right border-top pt-3'><button onClick={()=>redirecionaPaginaDespesaOuReceita(data)} className='btn btn-outline-success'><strong>Ir para {tipo_de_transacao}</strong></button></p>
            )
        }
    }

    return(
        <>
            {/*INICIO*/}

            { exibeAcertosNosExtratos &&
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
                    lancamentosDocumentos && lancamentosDocumentos.length > 0 ? (
                            <TabelaAcertosDocumentos
                                lancamentosDocumentos={lancamentosDocumentos}
                                rowsPerPageAcertosDocumentos={rowsPerPageAcertosDocumentos}
                                expandedRowsDocumentos={expandedRowsDocumentos}
                                setExpandedRowsDocumentos={setExpandedRowsDocumentos}
                                rowExpansionTemplateDocumentos={rowExpansionTemplateDocumentos}
                            />
                        ):
                        <p className='text-center fonte-18 mt-4'><strong>Não existem documentos para serem exibidos</strong></p>
                }
            </>
        </>
    )
}
export default memo(ExibeAcertosEmLancamentosEDocumentosPorConta)