import React, {useCallback, useEffect, useState} from "react";
import {
    getListaDespesas,
    getListaDespesasPaginacao, ordenacaoDespesas, ordenacaoDespesasPaginacao
} from "../../../../services/escolas/Despesas.service";
import {getSomaDosTotais} from "../../../../services/escolas/RateiosDespesas.service";
import {SomaDasDespesas} from "../SomaDasDespesas";
import moment from "moment/moment";
import {Route} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";
import {redirect} from "../../../../utils/redirect";
import {Col, Row} from "reactstrap";
import {gerarUuid} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {Paginacao} from "./Paginacao";
import {FormFiltrosAvancados} from "../FormFiltrosAvancados";
import "./lista-de-despesas.scss"
import Loading from "../../../../utils/Loading";
import {MsgImgCentralizada} from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg";
import {MsgImgLadoDireito} from "../../../Globais/Mensagens/MsgImgLadoDireito";
import useTagInformacaoTemplate
    from "../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useTagInformacaoTemplate";
import {LegendaInformacao} from "./LegendaInformacao";
import {Ordenacao} from "./Ordenacao";
import {tr} from "date-fns/locale";
import {LimparArgumentosOrdenacao} from "./LimparOrdenacao";
import {FormFiltroPorEspecificacaoMaterialServico} from "../FormFiltroPorEspecificacaoMaterialServico";

export const ListaDeDespesas = () => {

    const divisorPaginas = 10
    const tagInformacao = useTagInformacaoTemplate()


    const initFiltrosAvancados = {
        filtrar_por_termo: "",
        aplicacao_recurso: "",
        acao_associacao: "",
        despesa_status: "",
        fornecedor: "",
        data_inicio: "",
        data_fim: "",
        conta_associacao: "",
        vinculo_atividade: "",
    }

    const initOrdenacao = {
        ordenar_por_numero_do_documento: '',
        ordenar_por_data_especificacao: '',
        ordenar_por_valor: '',
        ordenar_por_imposto: false,
    }

    const [despesas, setDespesas] = useState([])
    const [totalDePaginas, setTotalDePaginas] = useState(0)
    const [somaDosTotais, setSomaDosTotais] = useState({})
    const [btnMaisFiltros, setBtnMaisFiltros] = useState(false)
    const [paginacaoAtual, setPaginacaoAtual] = useState(1)
    const [forcarPrimeiraPagina, setForcarPrimeiraPagina] = useState('')
    const [filtrosAvancados, setFiltrosAvancados] = useState(initFiltrosAvancados)
    const [loading, setLoading] = useState(true)
    const [filtro_informacoes, set_filtro_informacoes] = useState([])
    const [filtro_vinculo_atividades, set_filtro_vinculo_atividades] = useState([])
    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false)
    const [showModalOrdenar, setShowModalOrdenar] = useState(false)
    const [camposOrdenacao, setCamposOrdenacao] = useState(initOrdenacao)
    const [buscaUtilizandoOrdenacao, setBuscaUtilizandoOrdenacao] = useState(false)

    const handleChangeFiltroInformacoes = (value) => {
        set_filtro_informacoes([...value]);
    }

    const handleChangeFiltroVinculoAtividades = (value) => {
        set_filtro_vinculo_atividades([...value]);
    }

    const buscaDespesas = useCallback(async () => {
        let despesas = await getListaDespesas()
        let results = despesas.results
        let numeroDePaginas = despesas.count;
        setDespesas(results)
        setTotalDePaginas(Math.ceil((numeroDePaginas) / divisorPaginas))
        setLoading(false)
    }, [])

    useEffect(() => {
        buscaDespesas()
            .catch(console.error);
    }, [buscaDespesas])

    const buscaDespesasPaginacao = async (page) => {
        setPaginacaoAtual(page)
        let despesas = await getListaDespesasPaginacao(page);
        let results = despesas.results
        setDespesas(results)
        let numeroDePaginas = despesas.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas) / divisorPaginas))
    }

    const reusltadoSomaDosTotais = useCallback(async (palavra = "", aplicacao_recurso = "", acao_associacao__uuid = "", despesa__status = "", fornecedor = "", data_inicio = "", data_fim = "", conta_associacao__uuid = '', filtro_vinculo_atividades = [], filtro_informacoes = []) => {
        const somaDosTotais = await getSomaDosTotais(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status, fornecedor, data_inicio, data_fim, conta_associacao__uuid, filtro_vinculo_atividades, filtro_informacoes);
        setSomaDosTotais(somaDosTotais)
    }, []);

    useEffect(() => {
        reusltadoSomaDosTotais()
            .catch(console.error);
    }, [reusltadoSomaDosTotais])

    const especificacaoDataTemplate = (despesa, rateio) => {
        return (
            <div>
                <span>
                    {rateio.especificacao_material_servico ? rateio.especificacao_material_servico.descricao : ''}
                </span>
                <br/>
                <span>
                    Data:{' '}
                    {despesa.data_documento ? moment(despesa.data_documento).format('DD/MM/YYYY') : ''}
                </span>
            </div>
        )
    }

    const valorTotalTemplate = (rateio) => {
        const valorFormatado = parseFloat(rateio.valor_rateio)
            ? parseFloat(rateio.valor_rateio).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '';

        return <span>{valorFormatado}</span>
    }

    const novaDespesaButton = () => {
        return (
            <Route
                render={({history}) => (
                    <button
                        onClick={() => history.push('/cadastro-de-despesa')}
                        type="button"
                        className="btn btn btn-outline-success float-right mt-2"
                        disabled={!visoesService.getPermissoes(['add_despesa'])}
                    >
                        Cadastrar despesa
                    </button>
                )}
            />
        )
    }

    const redirecionaDetalhe = despesa => {
        let url
        if (despesa.receitas_saida_do_recurso) {
            url = `/cadastro-de-despesa-recurso-proprio/${despesa.receitas_saida_do_recurso}/${despesa.uuid}`
        } else {

            if (despesa && despesa.despesa_geradora_do_imposto && despesa.despesa_geradora_do_imposto.uuid) {
                url = '/edicao-de-despesa/' + despesa.despesa_geradora_do_imposto.uuid;
            } else {
                url = '/edicao-de-despesa/' + despesa.uuid;
            }
        }
        redirect(url)
    };

    const onClickBtnMaisFiltros = () => {
        setBtnMaisFiltros(!btnMaisFiltros)
    };

    const retornaStatusColor = (despesa) => {
        return despesa.status === 'COMPLETO' ? 'ptrf-despesa-status-ativo' : 'ptrf-despesa-status-inativo';
    }

    const retornaStatusText = (despesa) => {
        return despesa.status === 'COMPLETO' ? 'Status: COMPLETO' : 'Status: RASCUNHO';
    }

    const tipoLancamentoTemplateDespesaGeradoraDoImposto = (rowData) => {
        return (
            <>
                <span>{rowData.numero_documento}</span>
                <br/>
                <span className={retornaStatusColor(rowData)}>{retornaStatusText(rowData)}</span>
            </>
        )
    }

    const tipoLancamentoTemplateDespesasImpostos = (rowData) => {
        return (
            <>
                <span>{rowData.numero_documento}</span>
                <br/>
                <span className={retornaStatusColor(rowData)}>{retornaStatusText(rowData)}</span>
            </>
        )
    }

    const tipoLancamentoTemplate = (rowData) => {

        if (rowData.despesa_geradora_do_imposto && rowData.despesa_geradora_do_imposto.uuid) {
            return tipoLancamentoTemplateDespesaGeradoraDoImposto(rowData)
        } else if (rowData.despesas_impostos && rowData.despesas_impostos.length > 0) {
            return tipoLancamentoTemplateDespesasImpostos(rowData)
        } else {
            return (
                <>
                    <span>{rowData.numero_documento}</span>
                    <br/>
                    <span className={retornaStatusColor(rowData)}>{retornaStatusText(rowData)}</span>
                </>
            )
        }
    }

    // Ordenacao
    const handleChangeOrdenacao = (name, value) => {
        setCamposOrdenacao({
            ...camposOrdenacao,
            [name]: value
        });
    };

    const limparOrdenacao = async () =>{
        setCamposOrdenacao(initOrdenacao)
        let _limpar_ordenacao = 'SIM'
        await onSubmitOrdenar(_limpar_ordenacao)
    }

    const onSubmitOrdenar = async (_limpar_ordenacao) => {
        setShowModalOrdenar(false)
        setLoading(true)
        setBuscaUtilizandoOrdenacao(true)
        await buscaDespesasOrdenacao(_limpar_ordenacao);
    }

    const buscaDespesasOrdenacao = async (_limpar_ordenacao= 'NAO') => {
        setForcarPrimeiraPagina(gerarUuid)
        let data_inicio = filtrosAvancados.data_inicio ? moment(new Date(filtrosAvancados.data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = filtrosAvancados.data_fim ? moment(new Date(filtrosAvancados.data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : null;

        let lista_retorno_api

        if (_limpar_ordenacao === 'SIM'){
            lista_retorno_api = await ordenacaoDespesas(
                filtrosAvancados.filtrar_por_termo,
                filtrosAvancados.aplicacao_recurso,
                filtrosAvancados.acao_associacao,
                filtrosAvancados.despesa_status,
                filtrosAvancados.fornecedor,
                data_inicio,
                data_fim,
                filtrosAvancados.conta_associacao,
                filtro_vinculo_atividades,
                filtro_informacoes,
            );
        }else {
            lista_retorno_api = await ordenacaoDespesas(
                filtrosAvancados.filtrar_por_termo,
                filtrosAvancados.aplicacao_recurso,
                filtrosAvancados.acao_associacao,
                filtrosAvancados.despesa_status,
                filtrosAvancados.fornecedor,
                data_inicio,
                data_fim,
                filtrosAvancados.conta_associacao,
                filtro_vinculo_atividades,
                filtro_informacoes,
                camposOrdenacao.ordenar_por_numero_do_documento,
                camposOrdenacao.ordenar_por_data_especificacao,
                camposOrdenacao.ordenar_por_valor,
                camposOrdenacao.ordenar_por_imposto,
            );
        }


        let results = lista_retorno_api.results
        setDespesas(results)
        let numeroDePaginas = lista_retorno_api.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas) / divisorPaginas))
        setLoading(false)
    }

    const buscaDespesasOrdenacaoPaginacao = async (page) => {
        setPaginacaoAtual(page)
        let data_inicio = filtrosAvancados.data_inicio ? moment(new Date(filtrosAvancados.data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = filtrosAvancados.data_fim ? moment(new Date(filtrosAvancados.data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let lista_retorno_api = await ordenacaoDespesasPaginacao(
            filtrosAvancados.filtrar_por_termo,
            filtrosAvancados.aplicacao_recurso,
            filtrosAvancados.acao_associacao,
            filtrosAvancados.despesa_status,
            filtrosAvancados.fornecedor,
            data_inicio, data_fim,
            filtrosAvancados.conta_associacao,
            filtro_vinculo_atividades,
            filtro_informacoes,
            camposOrdenacao.ordenar_por_numero_do_documento,
            camposOrdenacao.ordenar_por_data_especificacao,
            camposOrdenacao.ordenar_por_valor,
            camposOrdenacao.ordenar_por_imposto,
            page
        );
        let results = lista_retorno_api.results
        setDespesas(results)
        let numeroDePaginas = lista_retorno_api.count;
        setTotalDePaginas(Math.ceil((numeroDePaginas) / divisorPaginas))
    }


    return (
        <div>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="50"
                        marginBottom="0"
                    />
                ) :
                <>
                    <Row>
                        <div className="col-12">
                            <p>{!btnMaisFiltros ? "Especificação do material ou serviço" : ""}</p>
                        </div>
                        <Col lg={7} xl={7}
                             className={`pr-0 ${!btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
                            <i className="float-left fas fa-file-signature"
                               style={{marginRight: '5px', color: '#42474A'}}>
                            </i>
                            <FormFiltroPorEspecificacaoMaterialServico
                                reusltadoSomaDosTotais={reusltadoSomaDosTotais}
                                filtrosAvancados={filtrosAvancados}
                                setFiltrosAvancados={setFiltrosAvancados}
                                buscaDespesasOrdenacao={buscaDespesasOrdenacao}
                                setBuscaUtilizandoOrdenacao={setBuscaUtilizandoOrdenacao}
                                limparOrdenacao={limparOrdenacao}
                                setLoading={setLoading}
                            />
                        </Col>
                        <Col lg={2} xl={2}
                             className={`pl-sm-0 mt-2 ${!btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
                            <button
                                onClick={onClickBtnMaisFiltros}
                                type="button"
                                className="btn btn btn-outline-success"
                            >
                                Mais Filtros
                            </button>
                        </Col>
                        <Col lg={!btnMaisFiltros ? 3 : 12} xl={!btnMaisFiltros ? 3 : 12}>
                            <span className="float-right">{novaDespesaButton()}</span>
                        </Col>
                    </Row>

                    <FormFiltrosAvancados
                        btnMaisFiltros={btnMaisFiltros}
                        onClickBtnMaisFiltros={onClickBtnMaisFiltros}
                        reusltadoSomaDosTotais={reusltadoSomaDosTotais}
                        iniciaLista={buscaDespesas}
                        setLoading={setLoading}
                        filtrosAvancados={filtrosAvancados}
                        setFiltrosAvancados={setFiltrosAvancados}
                        buscaDespesasOrdenacao={buscaDespesasOrdenacao}
                        setBuscaUtilizandoOrdenacao={setBuscaUtilizandoOrdenacao}
                        forcarPrimeiraPagina={setForcarPrimeiraPagina}
                        filtro_informacoes={filtro_informacoes}
                        set_filtro_informacoes={set_filtro_informacoes}
                        filtro_vinculo_atividades={filtro_vinculo_atividades}
                        set_filtro_vinculo_atividades={set_filtro_vinculo_atividades}
                        handleChangeFiltroVinculoAtividades={handleChangeFiltroVinculoAtividades}
                        handleChangeFiltroInformacoes={handleChangeFiltroInformacoes}
                        limparOrdenacao={limparOrdenacao}
                    />

                    {despesas && despesas.length > 0 && Object.entries(somaDosTotais).length > 0 ? (
                            <>
                                <SomaDasDespesas
                                    somaDosTotais={somaDosTotais}
                                />

                                <div className='text-right'>
                                    <LegendaInformacao
                                        showModalLegendaInformacao={showModalLegendaInformacao}
                                        setShowModalLegendaInformacao={setShowModalLegendaInformacao}
                                    />
                                    {despesas && despesas.length > 0 &&
                                        <>
                                            <Ordenacao
                                                showModalOrdenar={showModalOrdenar}
                                                setShowModalOrdenar={setShowModalOrdenar}
                                                camposOrdenacao={camposOrdenacao}
                                                handleChangeOrdenacao={handleChangeOrdenacao}
                                                onSubmitOrdenar={onSubmitOrdenar}
                                            />
                                            <LimparArgumentosOrdenacao
                                                limparOrdenacao={limparOrdenacao}
                                                camposOrdenacao={camposOrdenacao}
                                            />
                                        </>
                                    }
                                </div>

                                <table id="tabela-lista-despesas" className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th style={{width: '17%'}} scope="col">Nº do documento</th>
                                        <th style={{width: '17%'}} scope="col">Informações</th>
                                        <th scope="col">Especif. do material ou serviço</th>
                                        <th scope="col">Aplicação</th>
                                        <th style={{width: '12%'}} scope="col">Tipo de ação</th>
                                        <th style={{width: '12%'}} scope="col">Valor (R$)</th>
                                    </tr>
                                    </thead>
                                    {despesas.map((despesa, index) =>
                                        <tbody key={`tbody-despesa-${index}`} onClick={() => redirecionaDetalhe(despesa)}>
                                        <tr key={`tr-despesa-${index}`}>
                                            <td key={`td-despesa-numero_documento-${index}`}
                                                rowSpan={despesa.rateios.length > 0 ? despesa.rateios.length + 1 : 2}>
                                                {tipoLancamentoTemplate(despesa)}
                                            </td>
                                            <td rowSpan={despesa.rateios.length > 0 ? despesa.rateios.length + 1 : 2}>{tagInformacao(despesa)}</td>
                                        </tr>


                                        {despesa.rateios.length > 0 ?
                                            despesa.rateios.map((rateio, index) =>
                                                <tr key={`tr-rateio-${index}`}>

                                                    <td key={`td-rateio-especificacao-${index}`}>{especificacaoDataTemplate(despesa, rateio)}</td>
                                                    <td className="centraliza-conteudo-tabela text-center">{rateio.aplicacao_recurso}</td>
                                                    {rateio.acao_associacao ?
                                                        <td className="centraliza-conteudo-tabela text-center"
                                                            key={`td-rateio-acao-${index}`}>{rateio.acao_associacao.acao.nome}</td>
                                                        :
                                                        <td className="centraliza-conteudo-tabela text-center">-</td>
                                                    }
                                                    <td className="centraliza-conteudo-tabela text-center"
                                                        key={`td-rateio-valor-${index}`}>{valorTotalTemplate(rateio)}</td>
                                                </tr>
                                            )
                                            :
                                            <tr>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                            </tr>
                                        }
                                        </tbody>
                                    )}
                                </table>

                                {totalDePaginas && totalDePaginas > 1 && totalDePaginas >= paginacaoAtual &&
                                    <Paginacao
                                        paginacaoPaginasTotal={totalDePaginas}
                                        buscaDespesasPaginacao={buscaDespesasPaginacao}
                                        buscaDespesasFiltrosAvancadosPaginacao={buscaDespesasOrdenacaoPaginacao}
                                        forcarPrimeiraPagina={forcarPrimeiraPagina}
                                        buscaUtilizandoOrdenacao={buscaUtilizandoOrdenacao}
                                        buscaDespesasOrdenacaoPaginacao={buscaDespesasOrdenacaoPaginacao}

                                    />
                                }

                            </>
                        ) :
                        buscaUtilizandoOrdenacao ? (
                                <MsgImgCentralizada
                                    texto='Não encontramos resultados, verifique os filtros e tente novamente.'
                                    img={Img404}
                                />
                            ) :
                            <MsgImgLadoDireito
                                texto='A sua escola ainda não possui despesas cadastradas, clique no botão "Cadastrar despesa" para começar.'
                                img={Img404}
                            />
                    }
                </>
            }
        </div>
    )
}
