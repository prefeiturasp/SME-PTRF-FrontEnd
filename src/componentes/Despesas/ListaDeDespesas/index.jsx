import React, {Component} from 'react'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {Row, Col} from 'reactstrap'
import {getListaRateiosDespesas, filtroPorPalavra} from '../../../services/RateiosDespesas.service'
import {redirect} from '../../../utils/redirect.js'
import '../../../paginas/404/pagina-404.scss'
import {Route} from 'react-router-dom'
import moment from 'moment'
import {FormFiltroPorPalavra} from "../../FormFiltroPorPalavra";
import Img404 from "../../../assets/img/img-404.svg"
import {MsgImgLadoDireito} from "../../Mensagens/MsgImgLadoDireito";
import {MsgImgCentralizada} from "../../Mensagens/MsgImgCentralizada";

export class ListaDeDespesas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rateiosDespesas: [],
            inputPesquisa: "",
            filtro_por_palavra: false,
        }
        this.handleSubmitFormFiltroPorPalavra = this.handleSubmitFormFiltroPorPalavra.bind(this);
        this.handleChangeFormFiltroPorPalavra = this.handleChangeFormFiltroPorPalavra.bind(this);
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
                    <Button
                        icon="pi pi-file"
                        label="Cadastrar despesa"
                        style={{marginBottom: '.80em'}}
                        className="btn-coad-background-outline"
                        onClick={() => {
                            history.push('/cadastro-de-despesa')
                        }}
                    />
                )}
            />
        )
    }

    redirecionaDetalhe = value => {
        console.log(value)
        const url = '/edicao-de-despesa/' + value.despesa
        redirect(url)
    }

    handleChangeFormFiltroPorPalavra = (event) => {
        this.setState({inputPesquisa: event.target.value});
    }

    handleSubmitFormFiltroPorPalavra = async (event) => {
        event.preventDefault();
        const rateiosDespesas = await filtroPorPalavra(this.state.inputPesquisa)
        this.setState({rateiosDespesas})
        this.setState({filtro_por_palavra: true})
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

                    <Col lg={8} xl={8}>
                        <i
                            className="float-left fas fa-file-signature"
                            style={{marginRight: '5px', color: '#42474A'}}
                        ></i>
                        <FormFiltroPorPalavra
                            onSubmit={this.handleSubmitFormFiltroPorPalavra}
                            inputValue={this.state.inputPesquisa}
                            onChange={this.handleChangeFormFiltroPorPalavra}
                        />

                    </Col>
                    <Col lg={4} xl={4}>
                        <span className="float-right">{this.novaDespesaButton()}</span>
                    </Col>
                </Row>
                {rateiosDespesas.length > 0 ? (
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
                    ) :
                    this.state.filtro_por_palavra ? (
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
