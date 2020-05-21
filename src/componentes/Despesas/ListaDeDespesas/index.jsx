import React, {Component} from 'react'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Row, Col} from 'reactstrap'
import {getListaRateiosDespesas} from '../../../services/RateiosDespesas.service'
import {redirect} from '../../../utils/redirect.js'
import '../../../paginas/404/pagina-404.scss'
import {Route} from 'react-router-dom'
import moment from 'moment'
import {FormFiltroPorPalavra} from "../../FormFiltroPorPalavra";
import Img404 from "../../../assets/img/img-404.svg"
import {MsgImgLadoDireito} from "../../Mensagens/MsgImgLadoDireito";
import {MsgImgCentralizada} from "../../Mensagens/MsgImgCentralizada";
import "./lista-de-despesas.scss"
import {FormFiltrosAvancados} from "../FormFiltrosAvancados";
import {SomaDasDespesas} from "../SomaDasDespesas";

export class ListaDeDespesas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rateiosDespesas: [],
            inputPesquisa: "",
            buscaUtilizandoFiltro: false,
            btnMaisFiltros: false,
        }
    }

    buscaRateiosDespesas = async () => {
        const rateiosDespesas = await getListaRateiosDespesas()
        this.setState({rateiosDespesas})
    }

    componentDidMount() {
        this.buscaRateiosDespesas()
    }

    numeroDocumentoStatusTemplate(rowData, column) {
        const statusColor =
            rowData['status_despesa'] === 'COMPLETO'
                ? 'ptrf-despesa-status-ativo'
                : 'ptrf-despesa-status-inativo'
        const statusText =
            rowData['status_despesa'] === 'COMPLETO'
                ? 'Status: Completo'
                : 'Status: Incompleto'
        return (
            <div>
                <span>{rowData['numero_documento']}</span>
                <br></br>
                <span className={statusColor}>{statusText}</span>
            </div>
        )
    }

    especificacaoDataTemplate(rowData, column) {
        return (
            <div>
        <span>
          {rowData['especificacao_material_servico']
              ? rowData['especificacao_material_servico'].descricao
              : ''}
        </span>
                <br></br>
                <span>
          Data:{' '}
                    {rowData['data_documento']
                        ? moment(rowData['data_documento']).format('DD/MM/YYYY')
                        : ''}
        </span>
            </div>
        )
    }

    valorTotalTemplate(rowData, column) {
        const valorFormatado = rowData['valor_total']
            ? rowData['valor_total'].toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : ''
        return <span>{valorFormatado}</span>
    }

    novaDespesaButton() {
        return (
            <Route
                render={({history}) => (
                    <button
                        onClick={() => history.push('/cadastro-de-despesa')}
                        type="button"
                        className="btn btn btn-outline-success float-right"
                    >
                        Cadastrar despesa
                    </button>
                )}
            />
        )
    }

    redirecionaDetalhe = value => {
        const url = '/edicao-de-despesa/' + value.despesa
        redirect(url)
    }

    onClickBtnMaisFiltros = (event) => {
        this.setState({inputPesquisa: ""})
        this.setState({btnMaisFiltros: !this.state.btnMaisFiltros})
    }

    render() {
        const {rateiosDespesas} = this.state
        const rowsPerPage = 10

        return (
            <div>
                <Row>
                    <div className="col-12">
                        <p>Filtrar por</p>
                    </div>
                    <Col lg={7} xl={7} className={`pr-0 ${!this.state.btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
                        <i
                            className="float-left fas fa-file-signature"
                            style={{marginRight: '5px', color: '#42474A'}}
                        ></i>

                        <FormFiltroPorPalavra
                            inputPesquisa={this.state.inputPesquisa}
                            setInputPesquisa={(inputPesquisa)=>this.setState({inputPesquisa})}
                            buscaUtilizandoFiltro={this.state.buscaUtilizandoFiltro}
                            setBuscaUtilizandoFiltro={(buscaUtilizandoFiltro)=>this.setState({buscaUtilizandoFiltro})}
                            setLista={(rateiosDespesas)=>this.setState({rateiosDespesas})}
                            origem="Despesas"
                        />
                    </Col>
                    <Col lg={2} xl={2} className={`pl-sm-0 ${!this.state.btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
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
                    btnMaisFiltros = {this.state.btnMaisFiltros}
                    onClickBtnMaisFiltros={this.onClickBtnMaisFiltros}
                    buscaUtilizandoFiltro={this.state.buscaUtilizandoFiltro}
                    setBuscaUtilizandoFiltro={(buscaUtilizandoFiltro)=>this.setState({buscaUtilizandoFiltro})}
                    setLista={(rateiosDespesas)=>this.setState({rateiosDespesas})}
                    iniciaLista={this.buscaRateiosDespesas}
                />

                {rateiosDespesas.length > 0 ? (

                    <>
                        <SomaDasDespesas/>
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
            </div>
        )
    }
}
