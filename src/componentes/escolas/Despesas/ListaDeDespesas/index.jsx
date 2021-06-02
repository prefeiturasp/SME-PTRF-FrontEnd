import React, {Component} from 'react'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Row, Col} from 'reactstrap'
import {getListaRateiosDespesas, getSomaDosTotais} from '../../../../services/escolas/RateiosDespesas.service'
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


export class ListaDeDespesas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rateiosDespesas: [],
            somaDosTotais: {},
            inputPesquisa: "",
            buscaUtilizandoFiltro: false,
            btnMaisFiltros: false,
            loading: true,
        }
    }

    buscaRateiosDespesas = async (palavra = "", aplicacao_recurso = "", acao_associacao__uuid = "", despesa__status = "") => {
        const rateiosDespesas = await getListaRateiosDespesas();
        this.setState({rateiosDespesas})
    };

    reusltadoSomaDosTotais = async (palavra = "", aplicacao_recurso = "", acao_associacao__uuid = "", despesa__status = "", fornecedor = "", data_inicio = "", data_fim = "") => {
        const somaDosTotais = await getSomaDosTotais(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status, fornecedor, data_inicio, data_fim);
        this.setState({somaDosTotais});
    };

    componentDidMount() {
        this.buscaRateiosDespesas();
        this.reusltadoSomaDosTotais();
        this.setState({loading: false})
    }

    numeroDocumentoStatusTemplate(rowData) {
        const statusColor =
            rowData['status_despesa'] === 'COMPLETO'
                ? 'ptrf-despesa-status-ativo'
                : 'ptrf-despesa-status-inativo';
        const statusText =
            rowData['status_despesa'] === 'COMPLETO'
                ? 'Status: COMPLETO'
                : 'Status: RASCUNHO';
        return (
            <div>
                <span>{rowData['numero_documento']}</span>
                <br/>
                <span className={statusColor}>{statusText}</span>
            </div>
        )
    }

    especificacaoDataTemplate(rowData) {
        return (
            <div>
        <span>
          {rowData['especificacao_material_servico']
              ? rowData['especificacao_material_servico'].descricao
              : ''}
        </span>
                <br/>
                <span>
          Data:{' '}
                    {rowData['data_documento']
                        ? moment(rowData['data_documento']).format('DD/MM/YYYY')
                        : ''}
        </span>
            </div>
        )
    }

    valorTotalTemplate(rowData) {
        const valorFormatado = rowData['valor_total']
            ? rowData['valor_total'].toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : '';
        return <span>{valorFormatado}</span>
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

    redirecionaDetalhe = value => {
        const url = '/edicao-de-despesa/' + value.despesa;
        redirect(url)
    };

    onClickBtnMaisFiltros = () => {
        this.setState({inputPesquisa: ""});
        this.setState({btnMaisFiltros: !this.state.btnMaisFiltros})
    };

    render() {
        const {rateiosDespesas, somaDosTotais} = this.state;
        const rowsPerPage = 10;

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
                                    <p>Filtrar por {!this.state.btnMaisFiltros ? "especificação do material ou serviço" : ""}</p>
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
                                        setLista={(rateiosDespesas) => this.setState({rateiosDespesas})}
                                        reusltadoSomaDosTotais={this.reusltadoSomaDosTotais}
                                        origem="Despesas"
                                        setLoading={(loading) => this.setState({loading})}
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
                                buscaUtilizandoFiltro={this.state.buscaUtilizandoFiltro}
                                setBuscaUtilizandoFiltro={(buscaUtilizandoFiltro) => this.setState({buscaUtilizandoFiltro})}
                                setLista={(rateiosDespesas) => this.setState({rateiosDespesas})}
                                reusltadoSomaDosTotais={this.reusltadoSomaDosTotais}
                                iniciaLista={this.buscaRateiosDespesas}
                                setLoading={(loading) => this.setState({loading})}
                            />

                            {rateiosDespesas.length > 0 && Object.entries(somaDosTotais).length > 0 ? (
                                    <>
                                        <SomaDasDespesas
                                            somaDosTotais={somaDosTotais}
                                        />

                                        <DataTable
                                            value={rateiosDespesas}
                                            className="mt-3 datatable-footer-coad"
                                            paginator={rateiosDespesas.length > rowsPerPage}
                                            rows={rowsPerPage}
                                            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                            autoLayout={true}
                                            selectionMode="single"
                                            onRowClick={e => this.redirecionaDetalhe(e.data)}
                                        >
                                            <Column
                                                field="numero_documento"
                                                header="Número do documento"
                                                body={this.numeroDocumentoStatusTemplate}
                                            />
                                            <Column
                                                field="especificacao_material_servico.descricao"
                                                header="Especificação do material ou serviço"
                                                body={this.especificacaoDataTemplate}
                                            />
                                            <Column field="aplicacao_recurso" header="Aplicação"/>
                                            <Column field="acao_associacao.nome" header="Tipo de ação"/>
                                            <Column
                                                field="valor_total"
                                                header="Valor"
                                                body={this.valorTotalTemplate}
                                                style={{textAlign: 'right'}}
                                            />
                                        </DataTable>
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
