import React, {Component} from 'react'
import {Row, Col} from 'reactstrap'
import {getSomaDosTotais} from '../../../../services/escolas/RateiosDespesas.service'
import {getListaDespesas, getListaDespesasPaginacao, filtrosAvancadosDespesas, filtroPorPalavraDespesas, filtroPorPalavraDespesasPaginacao, filtrosAvancadosDespesasPaginacao} from '../../../../services/escolas/Despesas.service'
import {redirect} from '../../../../utils/redirect.js'
import '../../../../paginas/escolas/404/pagina-404.scss'
import {Route} from 'react-router-dom'
import moment from 'moment'
import {FormFiltroPorPalavra} from "../../../Globais/FormFiltroPorPalavra";
import Img404 from "../../../../assets/img/img-404.svg"
import {MsgImgLadoDireito} from "../../../Globais/Mensagens/MsgImgLadoDireito"
import {MsgImgCentralizada} from "../../../Globais/Mensagens/MsgImgCentralizada";
import "./lista-de-despesas.scss"
import {FormFiltrosAvancados} from "../FormFiltrosAvancados";
import {SomaDasDespesas} from "../SomaDasDespesas";
import Loading from "../../../../utils/Loading";
import {visoesService} from "../../../../services/visoes.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from "react-tooltip";
import {Paginacao} from "./Paginacao";
import { gerarUuid } from '../../../../utils/ValidacoesAdicionaisFormularios';


export class ListaDeDespesas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            despesas: [],
            somaDosTotais: {},
            inputPesquisa: "",
            buscaUtilizandoFiltro: false,
            btnMaisFiltros: false,
            loading: true,
            totalDePaginas : 0,
            paginacaoAtual: 1,
            filtrosAvancados: {
                filtrar_por_termo: "",
                aplicacao_recurso: "",
                acao_associacao: "",
                despesa_status: "",
                fornecedor: "",
                data_inicio: "",
                data_fim: "",
                conta_associacao: "",
                vinculo_atividade: "",
            },
            buscaUtilizandoFiltroAvancado: false,
            buscaUtilizandoFiltroPalavra: false,
            divisorPaginas: 10,
            forcarPrimeiraPagina: ''
        }
    }

    buscaDespesas = async (palavra = "", aplicacao_recurso = "", acao_associacao__uuid = "", despesa__status = "") => {
        const despesas = await getListaDespesas();
        const results = despesas.results
        let numeroDePaginas = despesas.count;
        this.setState({despesas: results})
        this.setState({totalDePaginas: Math.ceil((numeroDePaginas)/this.state.divisorPaginas)})
        this.setState({loading: false})

    };

    buscaDespesasPaginacao = async (page) => {
        this.setState({paginacaoAtual: page})
        let despesas = await getListaDespesasPaginacao(page);
        let results = despesas.results
        this.setState({despesas: results})
        let numeroDePaginas = despesas.count;
        this.setState({totalDePaginas: Math.ceil((numeroDePaginas)/this.state.divisorPaginas)})
    }


    buscaDespesasFiltrosPorPalavra = async () =>{
        this.setState({forcarPrimeiraPagina: gerarUuid()})
        let lista_retorno_api = await filtroPorPalavraDespesas(this.state.inputPesquisa)
        let results = lista_retorno_api.results
        this.setState({despesas: results})
        let numeroDePaginas = lista_retorno_api.count;
        this.setState({totalDePaginas: Math.ceil((numeroDePaginas)/this.state.divisorPaginas)})
        this.setState({loading: false})
    }

    buscaDespesasFiltrosPorPalavraPaginacao = async (page) => {
        this.setState({paginacaoAtual: page})
        let lista_retorno_api = await filtroPorPalavraDespesasPaginacao(this.state.inputPesquisa, page)
        let results = lista_retorno_api.results
        this.setState({despesas: results})
        let numeroDePaginas = lista_retorno_api.count;
        this.setState({totalDePaginas: Math.ceil((numeroDePaginas)/this.state.divisorPaginas)})
    }

    buscaDespesasFiltrosAvancados = async() => {
        this.setState({forcarPrimeiraPagina: gerarUuid()})
        let data_inicio = this.state.filtrosAvancados.data_inicio ? moment(new Date(this.state.filtrosAvancados.data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = this.state.filtrosAvancados.data_fim ? moment(new Date(this.state.filtrosAvancados.data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let lista_retorno_api = await filtrosAvancadosDespesas(this.state.filtrosAvancados.filtrar_por_termo, this.state.filtrosAvancados.aplicacao_recurso, this.state.filtrosAvancados.acao_associacao, this.state.filtrosAvancados.despesa_status, this.state.filtrosAvancados.fornecedor, data_inicio, data_fim, this.state.filtrosAvancados.conta_associacao, this.state.filtrosAvancados.vinculo_atividade);
        let results = lista_retorno_api.results
        this.setState({despesas: results})
        let numeroDePaginas = lista_retorno_api.count;
        this.setState({totalDePaginas: Math.ceil((numeroDePaginas)/this.state.divisorPaginas)})
        this.setState({loading: false})
    }

    buscaDespesasFiltrosAvancadosPaginacao = async(page) => {
        this.setState({paginacaoAtual: page})
        let data_inicio = this.state.filtrosAvancados.data_inicio ? moment(new Date(this.state.filtrosAvancados.data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = this.state.filtrosAvancados.data_fim ? moment(new Date(this.state.filtrosAvancados.data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let lista_retorno_api = await filtrosAvancadosDespesasPaginacao(this.state.filtrosAvancados.filtrar_por_termo, this.state.filtrosAvancados.aplicacao_recurso, this.state.filtrosAvancados.acao_associacao, this.state.filtrosAvancados.despesa_status, this.state.filtrosAvancados.fornecedor, data_inicio, data_fim, this.state.filtrosAvancados.conta_associacao, this.state.filtrosAvancados.vinculo_atividade, page);
        let results = lista_retorno_api.results
        this.setState({despesas: results})
        let numeroDePaginas = lista_retorno_api.count;
        this.setState({totalDePaginas: Math.ceil((numeroDePaginas)/this.state.divisorPaginas)})
    }

    reusltadoSomaDosTotais = async (palavra = "", aplicacao_recurso = "", acao_associacao__uuid = "", despesa__status = "", fornecedor = "", data_inicio = "", data_fim = "", conta_associacao__uuid='', vinculo_atividade__uuid='') => {
        const somaDosTotais = await getSomaDosTotais(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status, fornecedor, data_inicio, data_fim, conta_associacao__uuid, vinculo_atividade__uuid);
        this.setState({somaDosTotais});
    };

    componentDidMount() {
        this.buscaDespesas();
        this.reusltadoSomaDosTotais();
    }

    numeroDocumentoStatusTemplate(despesa){ 
        const statusColor =
            despesa.status === 'COMPLETO'
                ? 'ptrf-despesa-status-ativo'
                : 'ptrf-despesa-status-inativo';
        const statusText =
            despesa.status === 'COMPLETO'
                ? 'Status: COMPLETO'
                : 'Status: RASCUNHO';
        return (
            <>    
                <span>{despesa.numero_documento}</span>
                <br/>
                <span className={statusColor}>{statusText}</span>
            </>
        )
    }

    especificacaoDataTemplate(despesa, rateio) {
        return (
            <div>
                <span>
                {rateio.especificacao_material_servico
                    ? rateio.especificacao_material_servico.descricao
                    : ''}
                </span>
                        <br/>
                        <span>
                Data:{' '}
                            {despesa.data_documento
                                ? moment(despesa.data_documento).format('DD/MM/YYYY')
                                : ''}
                </span>
            </div>
        )
    }

    valorTotalTemplate(rateio){
        const valorFormatado = parseFloat(rateio.valor_rateio)
            ? parseFloat(rateio.valor_rateio).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '';

        if (rateio.saida_de_recurso_externo){
            return(
                <>
                    <span>{valorFormatado}</span>
                    <span data-html={true} data-tip='Despesa relativa a um <br/> crédito de recurso externo'>
                    <FontAwesomeIcon
                        style={{marginLeft: "3px", color: '#086397'}}
                        icon={faExclamationCircle}
                    />
                    </span>
                    <ReactTooltip html={true}/>
                </>

            )
        }
        else{
            return <span>{valorFormatado}</span>
        }
    }


    tagDataTemplate(rateio) {
        return (
            <>
                {rateio.tag
                    ?
                        <span className="badge badge-pill badge-primary d-flex justify-content-center" style={{backgroundColor: '#086397'}}>{rateio.tag.nome}</span>
                    :
                        <span>-</span>
                }
            </>
        )
    }

    novaDespesaButton() {
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

    redirecionaDetalhe = despesa => {
        let url
        if (despesa.receitas_saida_do_recurso) {
            url = `/cadastro-de-despesa-recurso-proprio/${despesa.receitas_saida_do_recurso}/${despesa.uuid}`
        } else {
            url = '/edicao-de-despesa/' + despesa.uuid;
        }
        redirect(url)
    };

    onClickBtnMaisFiltros = () => {
        this.setState({inputPesquisa: ""});
        this.setState({btnMaisFiltros: !this.state.btnMaisFiltros})
    };

    render() {
        const {despesas, somaDosTotais} = this.state;

        return (
            <div>
                {
                    this.state.loading ? (
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
                                    <p>Filtrar
                                        por {!this.state.btnMaisFiltros ? "especificação do material ou serviço" : ""}</p>
                                </div>
                                <Col lg={7} xl={7}
                                     className={`pr-0 ${!this.state.btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
                                    <i className="float-left fas fa-file-signature"
                                       style={{marginRight: '5px', color: '#42474A'}}>
                                    </i>

                                    <FormFiltroPorPalavra
                                        inputPesquisa={this.state.inputPesquisa}
                                        setInputPesquisa={(inputPesquisa) => this.setState({inputPesquisa})}
                                        buscaUtilizandoFiltro={this.state.buscaUtilizandoFiltro}
                                        setBuscaUtilizandoFiltro={(buscaUtilizandoFiltro) => this.setState({buscaUtilizandoFiltro})}
                                        setLista={(despesas) => this.setState({despesas})}
                                        reusltadoSomaDosTotais={this.reusltadoSomaDosTotais}
                                        origem="Despesas"
                                        setLoading={(loading) => this.setState({loading})}
                                        buscaDespesasFiltrosPorPalavra={this.buscaDespesasFiltrosPorPalavra}
                                        setBuscaUtilizandoFiltroPalavra={(buscaUtilizandoFiltroPalavra) => this.setState({buscaUtilizandoFiltroPalavra})}
                                        setBuscaUtilizandoFiltroAvancado={(buscaUtilizandoFiltroAvancado) => this.setState({buscaUtilizandoFiltroAvancado})}
                                        forcarPrimeiraPagina={(forcarPrimeiraPagina) => this.setState({forcarPrimeiraPagina})}
                                    />
                                </Col>
                                <Col lg={2} xl={2}
                                     className={`pl-sm-0 mt-2 ${!this.state.btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
                                    <button
                                        onClick={this.onClickBtnMaisFiltros}
                                        type="button"
                                        className="btn btn btn-outline-success"
                                    >
                                        Mais Filtros
                                    </button>
                                </Col>
                                <Col lg={!this.state.btnMaisFiltros ? 3 : 12} xl={!this.state.btnMaisFiltros ? 3 : 12}>
                                    <span className="float-right">{this.novaDespesaButton()}</span>
                                </Col>
                            </Row>

                            <FormFiltrosAvancados
                                btnMaisFiltros={this.state.btnMaisFiltros}
                                onClickBtnMaisFiltros={this.onClickBtnMaisFiltros}
                                setBuscaUtilizandoFiltro={(buscaUtilizandoFiltro) => this.setState({buscaUtilizandoFiltro})}
                                reusltadoSomaDosTotais={this.reusltadoSomaDosTotais}
                                iniciaLista={this.buscaDespesas}
                                setLoading={(loading) => this.setState({loading})}
                                filtrosAvancados={this.state.filtrosAvancados}
                                setFiltrosAvancados={(filtrosAvancados) => this.setState({filtrosAvancados})}
                                buscaDespesasFiltrosAvancados={this.buscaDespesasFiltrosAvancados}
                                setBuscaUtilizandoFiltroAvancado={(buscaUtilizandoFiltroAvancado) => this.setState({buscaUtilizandoFiltroAvancado})}
                                setBuscaUtilizandoFiltroPalavra={(buscaUtilizandoFiltroPalavra) => this.setState({buscaUtilizandoFiltroPalavra})}
                                forcarPrimeiraPagina={(forcarPrimeiraPagina) => this.setState({forcarPrimeiraPagina})}
                            />

                            {despesas.length > 0 && Object.entries(somaDosTotais).length > 0 ? (
                                    <>
                                        <SomaDasDespesas
                                            somaDosTotais={somaDosTotais}
                                        />

                                        <table id="tabela-lista-despesas" className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '17%'}} scope="col">Nº do documento</th>
                                                    <th scope="col">Especif. do material ou serviço</th>
                                                    <th scope="col">Aplicação</th>
                                                    <th style={{ width: '12%'}} scope="col">Tipo de ação</th>
                                                    <th scope="col">Vínculo a atividade</th>
                                                    <th style={{ width: '12%'}} scope="col">Valor (R$)</th>
                                                </tr>
                                            </thead>
                                            {this.state.despesas.map((despesa, index) => 
                                                <tbody key={`tbody-despesa-${index}`} onClick={e => this.redirecionaDetalhe(despesa)}>
                                                    <tr key={`tr-despesa-${index}`}>
                                                        <td key={`td-despesa-numero_documento-${index}`} rowSpan={despesa.rateios.length > 0 ? despesa.rateios.length + 1: 2}>{this.numeroDocumentoStatusTemplate(despesa)}</td>
                                                    </tr>

                                                    {despesa.rateios.length > 0
                                                        ?
                                                            despesa.rateios.map((rateio, index) =>
                                                                <tr key={`tr-rateio-${index}`}>
                                                                    <td key={`td-rateio-especificacao-${index}`}>{this.especificacaoDataTemplate(despesa, rateio)}</td> 
                                                                    <td className="centraliza-conteudo-tabela text-center">{rateio.aplicacao_recurso}</td>
                                                                    {rateio.acao_associacao
                                                                        ?
                                                                            <td className="centraliza-conteudo-tabela text-center" key={`td-rateio-acao-${index}`}>{rateio.acao_associacao.acao.nome}</td> 
                                                                        :
                                                                            <td className="centraliza-conteudo-tabela text-center">-</td>
                                                                    }
                                                                    <td className="centraliza-conteudo-tabela text-center" key={`td-rateio-tag-${index}`}>{this.tagDataTemplate(rateio)}</td> 
                                                                    <td className="centraliza-conteudo-tabela text-center" key={`td-rateio-valor-${index}`}>{this.valorTotalTemplate(rateio)}</td>  
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

                                        {this.state.totalDePaginas > 1 && this.state.totalDePaginas >= this.state.paginacaoAtual &&
                                            <Paginacao
                                                paginacaoPaginasTotal={this.state.totalDePaginas}
                                                buscaDespesasPaginacao={this.buscaDespesasPaginacao}
                                                buscaDespesasFiltrosPorPalavraPaginacao={this.buscaDespesasFiltrosPorPalavraPaginacao}
                                                buscaDespesasFiltrosAvancadosPaginacao={this.buscaDespesasFiltrosAvancadosPaginacao}
                                                buscaUtilizandoFiltroPalavra={this.state.buscaUtilizandoFiltroPalavra}
                                                buscaUtilizandoFiltroAvancado={this.state.buscaUtilizandoFiltroAvancado}
                                                buscaUtilizandoFiltro={this.state.buscaUtilizandoFiltro}
                                                forcarPrimeiraPagina={this.state.forcarPrimeiraPagina}
                                            />
                                        
                                        }  
                                    </>
                                ) :
                                this.state.buscaUtilizandoFiltro ? (
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
}
