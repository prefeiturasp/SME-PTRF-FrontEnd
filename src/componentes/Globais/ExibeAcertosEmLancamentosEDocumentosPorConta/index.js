import React, {Fragment, memo, useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import useValorTemplate from "../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate";
import useDataTemplate from "../../../hooks/Globais/useDataTemplate";
import useNumeroDocumentoTemplate from "../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate";
import {
    getContasDaAssociacao,
    getDocumentosAjustes,
    getLancamentosAjustes,
    getTiposDeAcertoLancamentos
} from "../../../services/dres/PrestacaoDeContas.service";
import {TabelaAcertosLancamentos} from "./TabelaAcertosLancamentos";
import TabsAcertosEmLancamentosPorConta from "./TabsAcertosEmLancamentosPorConta";
import Loading from "../../../utils/Loading";

// Redux
import {useDispatch} from "react-redux";
import {addDetalharAcertos, limparDetalharAcertos} from "../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions"
import TabelaAcertosDocumentos from "./TabelaAcertosDocumentos";
import {FiltrosAcertosDeLancamentos} from "./FiltrosAcertosDeLancamentos";
import {useCarregaPrestacaoDeContasPorUuid} from "../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";

const ExibeAcertosEmLancamentosEDocumentosPorConta = ({prestacaoDeContasUuid, analiseAtualUuid}) => {

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

    const [lancamentosAjustes, setLancamentosAjustes] = useState([])
    const [lancamentosDocumentos, setLancamentosDocumentos] = useState([])
    const [contasAssociacao, setContasAssociacao] = useState([])
    const [loadingLancamentos, setLoadingLancamentos] = useState(true)
    const [loadingDocumentos, setLoadingDocumentos] = useState(true)
    const [expandedRowsLancamentos, setExpandedRowsLancamentos] = useState(null);
    const [expandedRowsDocumentos, setExpandedRowsDocumentos] = useState(null);
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [contaUuid, setContaUuid] = useState('')
    const [listaTiposDeAcertoLancamentos, setListaTiposDeAcertoLancamentos] = useState([])
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0:true});

    const toggleBtnEscolheConta = (id) => {
        if (id !== Object.keys(clickBtnEscolheConta)[0]){
            setClickBtnEscolheConta({
                [id]: !clickBtnEscolheConta[id]
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



    const carregaAcertosLancamentos = useCallback(async (conta_uuid, filtrar_por_lancamento=null, filtrar_por_tipo_de_ajuste=null) => {
        setContaUuid(conta_uuid)
        setLoadingLancamentos(true)
        let lancamentos_ajustes = await getLancamentosAjustes(analiseAtualUuid, conta_uuid, filtrar_por_lancamento, filtrar_por_tipo_de_ajuste)
        setLancamentosAjustes(lancamentos_ajustes)
        setLoadingLancamentos(false)
    }, [analiseAtualUuid])

    const carregaAcertosDocumentos = useCallback(async () => {
        let documentos_ajustes = await getDocumentosAjustes(analiseAtualUuid)
        setLancamentosDocumentos(documentos_ajustes)
        setLoadingDocumentos(false)
    }, [analiseAtualUuid])

    useEffect(() => {
        if (contasAssociacao && contasAssociacao.length > 0){
            carregaAcertosLancamentos(contasAssociacao[0].uuid)
            carregaAcertosDocumentos(contasAssociacao[0].uuid)
            setClickBtnEscolheConta({0: true})
        }
    }, [contasAssociacao, carregaAcertosLancamentos, carregaAcertosDocumentos])

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

    const rowExpansionTemplateLancamentos = (data) => {
        if (data && data.analise_lancamento && data.analise_lancamento.solicitacoes_de_ajuste_da_analise && data.analise_lancamento.solicitacoes_de_ajuste_da_analise.length > 0) {
            return (
                <>
                {data.analise_lancamento.solicitacoes_de_ajuste_da_analise.map((ajuste, index) => (
                    <Fragment key={ajuste.id}>
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
                    <p className='text-right border-top pt-3'><button onClick={()=>redirecionaDetalhe(data)} className='btn btn-outline-success'><strong>Ir para página de acertos</strong></button></p>
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
                            <p className='mb-0'>{ajuste.tipo_acerto.nome}</p>
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

    const redirecionaDetalhe = (lancamento) => {
        addDispatchRedireciona(lancamento)
    }

    return(
        <>
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
                        <FiltrosAcertosDeLancamentos
                            stateFiltros={stateFiltros}
                            listaTiposDeAcertoLancamentos={listaTiposDeAcertoLancamentos}
                            handleChangeFiltros={handleChangeFiltros}
                            handleSubmitFiltros={handleSubmitFiltros}
                            limpaFiltros={limpaFiltros}
                        />
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
                                expandedRowsLancamentos={expandedRowsLancamentos}
                                setExpandedRowsLancamentos={setExpandedRowsLancamentos}
                                rowExpansionTemplateLancamentos={rowExpansionTemplateLancamentos}
                                rowsPerPageAcertosLancamentos={rowsPerPageAcertosLancamentos}
                                valor_template={valor_template}
                                dataTemplate={dataTemplate}
                                numeroDocumentoTemplate={numeroDocumentoTemplate}
                                redirecionaDetalhe={redirecionaDetalhe}
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
                        <p className='text-center fonte-16 mt-5'><strong>Não existem documentos para serem exibidos</strong></p>
                    }
                </>
        </>
    )
}
export default memo(ExibeAcertosEmLancamentosEDocumentosPorConta)